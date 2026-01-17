# Models for Workshop Module
from app.modules.crm.models import Cars, Client
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import TEXT, Column
from datetime import datetime

# Correct import for forward references
if TYPE_CHECKING:
    from app.modules.auth.models import User
    from app.modules.crm.models import Cars, Client
    # Assuming Cars and Client models are in CRM module, adjust import path as necessary
    # Since we are using string forward refs, we might not strictly need imports for execution 
    # but good for type checking. For now, using string forward refs.
    pass

class PhotoCategory(str, Enum):
    ENTRY = "entry"
    PROCESS = "process"
    EXIT = "exit"

class Photos(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    income_id: int = Field(foreign_key="income.id")
    photo_url: str = Field()
    category: PhotoCategory = Field(default=PhotoCategory.ENTRY)

    income: Optional["Income"] = Relationship(back_populates="photos")

class Income(SQLModel, table=True):
    __tablename__ = "income"
    id: Optional[int] = Field(default=None, primary_key=True)
    car_id: int = Field(foreign_key="cars.id") 
    income_date_time: datetime = Field(default_factory=datetime.now)
    agreed_exit_date_time: Optional[datetime] = Field(default=None)
    exit_date_time: Optional[datetime] = Field(default=None)
    notes: Optional[str] = Field(default=None, sa_column=Column(TEXT))

    photos: List["Photos"] = Relationship(back_populates="income")
    car: Optional["Cars"] = Relationship()

    created_by: Optional[int] = Field(default=None, foreign_key="users.id")
    updated_by: Optional[int] = Field(default=None, foreign_key="users.id")
    deleted_by: Optional[int] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    deleted_at: Optional[datetime] = Field(default=None)
