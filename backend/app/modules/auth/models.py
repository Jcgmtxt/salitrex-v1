# Models for Auth Module
from pydantic import EmailStr
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    OPERATOR = "operator"

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=3, max_length=50)
    email: EmailStr = Field(min_length=3, max_length=50)
    hashed_password: str = Field(max_length=255)
    role: UserRole = Field(default=UserRole.OPERATOR)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default=datetime.now())
    updated_at: datetime = Field(default=datetime.now())
    deleted_at: Optional[datetime] = Field(default=None)