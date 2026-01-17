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
        # 1. Upload photos to S3
        photos_to_create = []
        
        # Note: We assume photo_files and categories lists are aligned 
        # or we handle them appropriately.
        for i, file in enumerate(photo_files):
            file_content = await file.read()
            category = categories[i] if i < len(categories) else PhotoCategory.ENTRY
            
            # Generate unique filename
            ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
            object_name = f"incomes/{uuid.uuid4()}.{ext}"
            
            url = s3_storage.upload_file(
                file_content=file_content,
                object_name=object_name,
                content_type=file.content_type
            )
            
            if url:
                photos_to_create.append(PhotoCreate(photo_url=url, category=category))

        # 2. Add photos to income_data
        income_data.photos = photos_to_create

        # 3. Create in DB
        return self.repository.create_income(income_data, user_id=user_id)

    def get_incomes(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        client_name: Optional[str] = None,
        created_by: Optional[int] = None
    ) -> List[Income]:
        return self.repository.get_incomes(skip=skip, limit=limit, client_name=client_name, created_by=created_by)

    def get_income_by_id(self, income_id: int) -> Optional[Income]:
        return self.repository.get_income_by_id(income_id)

    def update_income(self, income_id: int, income_data: IncomeUpdate, user_id: Optional[int] = None) -> Optional[Income]:
        return self.repository.update_income(income_id, income_data, user_id=user_id)
