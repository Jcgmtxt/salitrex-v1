from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from app.modules.crm.models import VehicleSize
from datetime import datetime

if TYPE_CHECKING:
    from app.modules.income.models import Income

class PaintConfig(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    price_per_cm2: float = Field(default=0.0)
    min_margin_percent: float = Field(default=30.0)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.now)

class VehicleSizeArea(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    size: VehicleSize = Field(unique=True)
    area_cm2: float = Field()

class PaintJob(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    income_id: int = Field(foreign_key="income.id")
    paint_type: str = Field() # e.g., "Metallic", "Matte", "Standard"
    base_price: float = Field() # area * price_per_cm2
    negotiated_price: float = Field() # Final price agreed with client
    margin_percent: float = Field() # (negotiated_price / base_price - 1) * 100
    
    created_at: datetime = Field(default_factory=datetime.now)
    created_by: Optional[int] = Field(default=None, foreign_key="users.id")

    income: Optional["Income"] = Relationship(back_populates="paint_jobs")
