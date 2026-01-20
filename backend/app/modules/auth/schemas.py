from pydantic.main import BaseModel
from pydantic import EmailStr
from app.modules.auth.models import UserRole

class CreateUser(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole

class UpdateUser(BaseModel):
    id: int
    name: str
    email: EmailStr
    password: str
    role: UserRole

class UserResponse(BaseModel):
    name: str
    email: EmailStr
    role: UserRole

class AuthUser(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    name: str
    email: EmailStr
    role: UserRole