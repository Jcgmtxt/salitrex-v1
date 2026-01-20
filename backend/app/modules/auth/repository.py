from datetime import datetime
from sqlmodel.orm.session import Session
from app.modules.auth.schemas import UserResponse, CreateUser, UpdateUser
from app.modules.auth.models import User
from app.core.security import encode_password
from fastapi import HTTPException
from typing import List

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user: CreateUser)-> UserResponse:
        db_user = User(
            name=user.name,
            email=user.email,
            hashed_password=encode_password(user.password),
            role=user.role,
            is_active=True,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            deleted_at=None
        )
        self.db.add(db_user)
        self.db.commit()
        return db_user

    def update_user(self, id: int, user: UpdateUser)-> UserResponse:
        db_user = self.db.get(User, id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if user.email != db_user.email:
            existing_user = self.get_user_by_email(user.email)
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already exists")

        db_user.name = user.name
        db_user.email = user.email
        db_user.role = user.role
        db_user.updated_at = datetime.now()
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update_password(self, user: UpdateUser)-> UserResponse:
        db_user = self.get_user_by_email(user.email)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        db_user.hashed_password = encode_password(user.password)
        db_user.updated_at = datetime.now()
        self.db.add(db_user)
        self.db.commit()
        return db_user
    
    def get_user(self, id: int)-> UserResponse:
        return self.db.query(User).filter(User.id == id).first()

    def get_user_by_email(self, email: str)-> UserResponse:
        return self.db.query(User).filter(User.email == email).first()

    def get_active_users(self)-> List[UserResponse]:
        return self.db.query(User).filter(User.is_active == True).all()

    def delete_user(self, user_id: int) -> None:
        user = self.db.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.is_active = False # Soft delete
        user.deleted_at = datetime.now()
        self.db.add(user)
        self.db.commit()


