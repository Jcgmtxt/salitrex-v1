from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel.orm.session import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.modules.auth.schemas import CreateUser, UpdateUser, AuthResponse, UserResponse
from app.modules.auth.repository import UserRepository
from app.modules.auth.dependencies import get_admin_user, get_current_active_user
from app.modules.auth.models import User

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
def register_user(user: CreateUser, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    existing_user = repo.get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return repo.create_user(user)

@router.post("/login", response_model=AuthResponse)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    repo = UserRepository(db)
    db_user = repo.get_user_by_email(form_data.username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    access_token = create_access_token(data={"sub": db_user.email})
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        name=db_user.name,
        email=db_user.email,
        role=db_user.role
    )

@router.get("/users", response_model=list[UserResponse], dependencies=[Depends(get_admin_user)])
def get_users(db: Session = Depends(get_db)):
    repo = UserRepository(db)
    return repo.get_active_users()

@router.put("/users", response_model=UserResponse, dependencies=[Depends(get_current_active_user)])
def update_user_info(user: UpdateUser, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    return repo.update_user(user)

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_admin_user)])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    repo.delete_user(user_id)



