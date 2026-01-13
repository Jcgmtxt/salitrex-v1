# Models for CRM Module
from pydantic import EmailStr
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
import enum

if TYPE_CHECKING:
    from ..auth.models import User

class DocumentType(str, enum.Enum):
    CC = "cc"
    CE = "ce"
    NIT = "nit"
    PASSPORT = "passport"
    
class Client(SQLModel, table=True):
    __tablename__ = "clients"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=3, max_length=255)
    document_type: DocumentType = Field(max_length=50)
    identity_number: str = Field(min_length=3, max_length=50, unique=True, index=True)
    #TODO: Preguntar si se requiere el campo de email
    email: EmailStr = Field(min_length=3, max_length=50, nullable=False, index=True)
    phone: str = Field(min_length=3, max_length=50, nullable=False, index=True)
    created_by: Optional[int] = Field(default=None, foreign_key="users.id")
    updated_by: Optional[int] = Field(default=None, foreign_key="users.id")
    deleted_by: Optional[int] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    deleted_at: Optional[datetime] = Field(default=None)

    cars: List["Cars"] = Relationship(back_populates="client")

    def __str__(self):
        return self.name

class Cars (SQLModel, table=True):
    __tablename__ = "cars"
    id: Optional[int] = Field(default=None, primary_key=True)
    client_id: int = Field(foreign_key="clients.id")
    license_plate: str = Field(min_length=3, max_length=50, unique=True, index=True)
    brand: str = Field(min_length=3, max_length=50)
    model: str = Field(min_length=3, max_length=50)
    year: int = Field()
    color: str = Field(min_length=3, max_length=50)
    created_by: Optional[int] = Field(default=None, foreign_key="users.id")
    updated_by: Optional[int] = Field(default=None, foreign_key="users.id")
    deleted_by: Optional[int] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    deleted_at: Optional[datetime] = Field(default=None)

    client: Optional["Client"] = Relationship(back_populates="cars")

    @property
    def client_name(self) -> Optional[str]:
        return self.client.name if self.client else None
    