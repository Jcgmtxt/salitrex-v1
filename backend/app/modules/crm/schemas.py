from app.modules.crm.models import DocumentType, VehicleSize
from pydantic.main import BaseModel
from pydantic import EmailStr
from datetime import datetime
from typing import List, Optional

# Base Schemas
class ClientBase(BaseModel):
    name: str
    document_type: DocumentType
    identity_number: str
    email: Optional[EmailStr] = None
    phone: str


class CarsBase(BaseModel):
    license_plate: str
    brand: str
    model: str
    year: int
    color: str
    size: VehicleSize

# Create Schemas
class ClientCreate(ClientBase):
    pass

class CarCreate(CarsBase):
    client_id: int

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    document_type: Optional[DocumentType] = None
    identity_number: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class CarUpdate(BaseModel):
    license_plate: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    color: Optional[str] = None
    size: Optional[VehicleSize] = None
    client_id: Optional[int] = None

# Read/Response Schemas
class CarResponse(CarsBase):
    id: int
    client_id: int
    # Flattened owner info for easy access
    client_name: Optional[str] = None 
    
    created_at: datetime
    
    class Config:
        from_attributes = True


class ClientResponse(ClientBase):
    id: int
    created_at: datetime
    # Proactive loading: Include cars automatically
    cars: List[CarResponse] = []

    class Config:
        from_attributes = True
