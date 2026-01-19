from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import List, Optional
from app.modules.income.models import PhotoCategory

# --- PHOTO SCHEMAS ---
class PhotoBase(BaseModel):
    s3_key: str
    category: PhotoCategory = PhotoCategory.ENTRY

class PhotoCreate(PhotoBase):
    pass

class PhotoRead(PhotoBase):
    id: int
    income_id: int
    presigned_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# --- INCOME SCHEMAS ---
class IncomeBase(BaseModel):
    car_id: int
    income_date_time: Optional[datetime] = Field(default_factory=datetime.now)
    agreed_exit_date_time: Optional[datetime] = None
    notes: Optional[str] = None

class IncomeCreate(IncomeBase):
    # Optional photos to add during creation
    photos: List[PhotoCreate] = []

class IncomeUpdate(BaseModel):
    car_id: Optional[int] = None
    income_date_time: Optional[datetime] = None
    agreed_exit_date_time: Optional[datetime] = None
    exit_date_time: Optional[datetime] = None
    notes: Optional[str] = None

class IncomeRead(IncomeBase):
    id: int
    exit_date_time: Optional[datetime] = None
    created_by: Optional[int] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

from app.modules.crm.schemas import CarResponse

class IncomeReadWithDetails(IncomeRead):
    photos: List[PhotoRead] = []
    car: Optional[CarResponse] = None
