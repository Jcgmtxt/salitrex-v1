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
    thumbnail_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# --- INCOME NOTE SCHEMAS ---
class IncomeNoteBase(BaseModel):
    note: str

class IncomeNoteCreate(IncomeNoteBase):
    pass

class IncomeNoteRead(IncomeNoteBase):
    id: int
    income_id: int
    created_at: datetime
    created_by: Optional[int] = None
    creator_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# --- SERVICE SCHEMAS (For Dispatcher) ---
class PaintServicePayload(BaseModel):
    paint_type: str = Field(..., description="E.g., Metallic, Matte, Standard")
    negotiated_price: float = Field(..., description="Final price agreed with client")

class ServicePayloads(BaseModel):
    paint: Optional[PaintServicePayload] = None
    # Future services like 'wash' or 'mechanical' can be added here

# --- INCOME SCHEMAS ---
class IncomeBase(BaseModel):
    car_id: int = Field(..., description="ID of the car being received")
    income_date_time: Optional[datetime] = Field(default_factory=datetime.now)
    agreed_exit_date_time: Optional[datetime] = Field(None, description="Estimated delivery date")
    notes: Optional[str] = Field(None, description="General observations")

class IncomeCreate(IncomeBase):
    # Optional photos to add during creation (mostly used internally after upload)
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
# Using TYPE_CHECKING or imported schema for PaintJob
from app.modules.paint.schemas import PaintJobRead

class IncomeReadWithDetails(IncomeRead):
    photos: List[PhotoRead] = []
    car: Optional[CarResponse] = None
    paint_jobs: List[PaintJobRead] = []
    notes_log: List[IncomeNoteRead] = []
