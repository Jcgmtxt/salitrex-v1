from typing import Annotated
from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel.orm.session import Session
from app.core.database import get_db
from app.modules.auth.schemas import CreateUser, UpdateUser, AuthResponse, UserResponse
from app.modules.auth.services import AuthService
from app.modules.auth.dependencies import get_admin_user, get_current_active_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
def register_user(user: CreateUser, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.register_user(user)

@router.post("/login", response_model=AuthResponse)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.login(form_data)

@router.get("/users", response_model=list[UserResponse], dependencies=[Depends(get_admin_user)])
def get_users(db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.get_active_users()

@router.put("/users/{user_id}", response_model=UserResponse, dependencies=[Depends(get_current_active_user)])
def update_user_info(user_id: int, user: UpdateUser, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.update_user(user_id, user)

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_admin_user)])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    service = AuthService(db)
    service.delete_user(user_id)



