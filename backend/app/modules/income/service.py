from typing import List, Optional
from fastapi import UploadFile
from sqlmodel import Session
from app.modules.income.repository import IncomeRepository
from app.modules.income.schemas import IncomeCreate, IncomeUpdate, PhotoCreate
from app.modules.common.storage import storage as s3_storage
from app.modules.income.models import Income, PhotoCategory, IncomeNote, Photos
import uuid
import datetime
import io
import logging
from PIL import Image

logger = logging.getLogger(__name__)

def get_thumbnail_key(s3_key: str) -> str:
    if not s3_key:
        return s3_key
    parts = s3_key.rsplit('.', 1)
    if len(parts) == 2:
        return f"{parts[0]}_thumb.{parts[1]}"
    return f"{s3_key}_thumb"

def generate_thumbnail(file_content: bytes, max_size: tuple[int, int] = (800, 800), quality: int = 70) -> bytes:
    try:
        img = Image.open(io.BytesIO(file_content))
        
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        out_io = io.BytesIO()
        img.save(out_io, format="JPEG", quality=quality, optimize=True)
        return out_io.getvalue()
    except Exception as e:
        logger.error(f"Error generating thumbnail: {e}")
        return file_content

class IncomeService:
    def __init__(self, db: Session):
        self.repository = IncomeRepository(db)

    async def create_income(
        self, 
        income_data: IncomeCreate, 
        photo_files: List[UploadFile], 
        categories: List[PhotoCategory],
        user_id: Optional[int] = None
    ) -> Income:
        # 1. Create income record first to get the ID
        # We temporarily remove photos from income_data to create the base record
        photos_save = income_data.photos
        income_data.photos = []
        income = self.repository.create_income(income_data, user_id=user_id)
        
        # 2. Get additional info for the path (Plate)
        from app.modules.crm.models import Cars
        car = self.repository.db.get(Cars, income.car_id)
        plate = car.license_plate if car else "unknown_plate"
        
        # 3. Process and Upload photos with structured path
        # Structure: incomes/YYYY/MM/DD/ingreso_ID/PLATE/CATEGORY/USER_ID_uuid.ext
        now = datetime.datetime.now()
        
        photos_to_create = []
        for i, file in enumerate(photo_files):
            file_content = await file.read()
            category = categories[i] if i < len(categories) else PhotoCategory.ENTRY
            
            # TODO: check this to make scalable
            ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
            object_name = f"incomes/{now.year}-{now.month:02d}-{now.day:02d}/ingreso-{income.id}_{plate}_{category.value}_{user_id or 'system'}_{uuid.uuid4()}.{ext}"
            
            s3_key = s3_storage.upload_file(
                file_content=file_content,
                object_name=object_name,
                content_type=file.content_type
            )
            
            if s3_key:
                # Generate and upload thumbnail
                thumbnail_content = generate_thumbnail(file_content)
                thumb_key = get_thumbnail_key(s3_key)
                s3_storage.upload_file(
                    file_content=thumbnail_content,
                    object_name=thumb_key,
                    content_type="image/jpeg"
                )
                
                photos_to_create.append(PhotoCreate(s3_key=s3_key, category=category))

        # 4. Save photo records in DB
        if photos_to_create:
            self.repository.add_photos(income.id, photos_to_create)
            # Refresh to include new photos in the return
            self.repository.db.refresh(income)

        return income

    def _add_presigned_urls(self, incomes: List[Income]):
        """Helper to add presigned URLs to photo models in place"""
        for income in incomes:
            for photo in income.photos:
                photo.presigned_url = s3_storage.get_presigned_url(photo.s3_key)
                thumb_key = get_thumbnail_key(photo.s3_key)
                photo.thumbnail_url = s3_storage.get_presigned_url(thumb_key)
        return incomes

    def get_incomes(
        self,
        query: Optional[str] = None,
        offset: int = 0,
        limit: int = 20,
        created_by: Optional[int] = None
    ) -> dict:
        incomes, total = self.repository.get_incomes(
            query=query, offset=offset, limit=limit, created_by=created_by
        )
        return {
            "items": self._add_presigned_urls(incomes),
            "total": total,
            "offset": offset,
            "limit": limit
        }

    def get_income_by_id(self, income_id: int) -> Optional[Income]:
        income = self.repository.get_income_by_id(income_id)
        if income:
            self._add_presigned_urls([income])
        return income

    def update_income(self, income_id: int, income_data: IncomeUpdate, user_id: Optional[int] = None) -> Optional[Income]:
        return self.repository.update_income(income_id, income_data, user_id=user_id)

    def add_note_to_income(self, income_id: int, note_text: str, user_id: int, creator_name: str) -> IncomeNote:
        return self.repository.create_note(income_id, note_text, user_id, creator_name)

    async def add_photo_to_income(
        self, 
        income_id: int, 
        file: UploadFile, 
        category: PhotoCategory, 
        user_id: int
    ) -> Photos:
        income = self.repository.get_income_by_id(income_id)
        if not income:
            raise ValueError("Income not found")
            
        from app.modules.crm.models import Cars
        car = self.repository.db.get(Cars, income.car_id)
        plate = car.license_plate if car else "unknown_plate"
        
        now = datetime.datetime.now()
        file_content = await file.read()
        
        ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        object_name = f"incomes/{now.year}-{now.month:02d}-{now.day:02d}/ingreso-{income.id}_{plate}_{category.value}_{user_id}_{uuid.uuid4()}.{ext}"
        
        s3_key = s3_storage.upload_file(
            file_content=file_content,
            object_name=object_name,
            content_type=file.content_type
        )
        
        if not s3_key:
            raise ValueError("Failed to upload file to storage")
            
        # Generate and upload thumbnail
        thumbnail_content = generate_thumbnail(file_content)
        thumb_key = get_thumbnail_key(s3_key)
        s3_storage.upload_file(
            file_content=thumbnail_content,
            object_name=thumb_key,
            content_type="image/jpeg"
        )
        
        photo_create = PhotoCreate(s3_key=s3_key, category=category)
        photos = self.repository.add_photos(income.id, [photo_create])
        
        # Add presigned URLs to return object
        photo = photos[0]
        photo.presigned_url = s3_storage.get_presigned_url(photo.s3_key)
        photo.thumbnail_url = s3_storage.get_presigned_url(thumb_key)
        return photo
