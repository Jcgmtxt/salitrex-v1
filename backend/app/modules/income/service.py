from typing import List, Optional
from fastapi import UploadFile
from sqlmodel import Session
from app.modules.income.repository import IncomeRepository
from app.modules.income.schemas import IncomeCreate, IncomeUpdate, PhotoCreate
from app.modules.common.storage import storage as s3_storage
from app.modules.income.models import Income, PhotoCategory
import uuid
import datetime

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
            
            ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
            object_name = f"incomes/{now.year}/{now.month:02d}/{now.day:02d}/ingreso_{income.id}/{plate}/{category.value}/{user_id or 'system'}_{uuid.uuid4()}.{ext}"
            
            s3_key = s3_storage.upload_file(
                file_content=file_content,
                object_name=object_name,
                content_type=file.content_type
            )
            
            if s3_key:
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
        return incomes

    def get_incomes(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        client_name: Optional[str] = None,
        created_by: Optional[int] = None
    ) -> List[Income]:
        incomes = self.repository.get_incomes(skip=skip, limit=limit, client_name=client_name, created_by=created_by)
        return self._add_presigned_urls(incomes)

    def get_income_by_id(self, income_id: int) -> Optional[Income]:
        income = self.repository.get_income_by_id(income_id)
        if income:
            self._add_presigned_urls([income])
        return income

    def update_income(self, income_id: int, income_data: IncomeUpdate, user_id: Optional[int] = None) -> Optional[Income]:
        return self.repository.update_income(income_id, income_data, user_id=user_id)
