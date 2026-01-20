from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.modules.crm.models import VehicleSize

class PaintConfigBase(BaseModel):
    price_per_cm2: float
    min_margin_percent: float = 30.0
    is_active: bool = True

class PaintConfigCreate(PaintConfigBase):
    pass

class PaintConfigRead(PaintConfigBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class VehicleSizeAreaBase(BaseModel):
    size: VehicleSize
    area_cm2: float

class VehicleSizeAreaCreate(VehicleSizeAreaBase):
    pass

class VehicleSizeAreaRead(VehicleSizeAreaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class PaintJobBase(BaseModel):
    paint_type: str
    negotiated_price: float

class PaintJobCreate(PaintJobBase):
    income_id: int

class PaintJobRead(PaintJobBase):
    id: int
    income_id: int
    base_price: float
    margin_percent: float
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PricingCalculation(BaseModel):
    car_size: VehicleSize
    area_cm2: float
    price_per_cm2: float
    base_price: float
    min_allowed_price: float
    min_margin_percent: float
