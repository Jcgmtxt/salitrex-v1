from app.modules.crm.models import Cars
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import TEXT, Column
from datetime import datetime

from app.modules.paint.models import PaintJob

# Correct import for forward references
if TYPE_CHECKING:
    from app.modules.crm.models import Cars

class PhotoCategory(str, Enum):
    ENTRY = "entry"
    PROCESS = "process"
    FINISHED = "finished"
    EXIT = "exit"

class Photos(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    income_id: int = Field(foreign_key="income.id")
    s3_key: str = Field()
    category: PhotoCategory = Field(default=PhotoCategory.ENTRY)
    
    # Non-persistent field for temporary URLs
    presigned_url: Optional[str] = None

    @property
    def thumbnail_url(self) -> Optional[str]:
        return getattr(self, "_thumbnail_url", None)

    @thumbnail_url.setter
    def thumbnail_url(self, value: Optional[str]):
        self._thumbnail_url = value

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
    paint_jobs: List["PaintJob"] = Relationship(back_populates="income")
    car: Optional["Cars"] = Relationship()

    created_by: Optional[int] = Field(default=None, foreign_key="users.id")
    updated_by: Optional[int] = Field(default=None, foreign_key="users.id")
    deleted_by: Optional[int] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    deleted_at: Optional[datetime] = Field(default=None)
