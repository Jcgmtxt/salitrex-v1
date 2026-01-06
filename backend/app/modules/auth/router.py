from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.orm.session import Session
from app.core.database import get_db
from app.modules.auth.schemas import CreateUser, UpdateUser, AuthUser, AuthResponse, UserResponse
from app.modules.auth.repository import UserRepository

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse )
def register_user(user: CreateUser, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    existing_user = repo.get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return repo.create_user(user)

@router.post("/login", response_model=AuthResponse)
def login(user: AuthUser, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    user = repo.get_user_by_email(user.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(user.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    return AuthResponse(
        access_token=encode_password(user.email),
        token_type="bearer",
        name=user.name,
        email=user.email,
        role=user.role
    )

@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    repo = UserRepository(db)
    return repo.get_active_users()

@router.put("/users", response_model=UserResponse)
def update_user_info(user: UpdateUser, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    return repo.update_user(user)


