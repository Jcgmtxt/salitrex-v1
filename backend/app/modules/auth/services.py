from app.modules.auth.repository import UserRepository
from app.modules.auth.schemas import CreateUser, UpdateUser
from fastapi import HTTPException
from sqlmodel.orm.session import Session

class AuthService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def register_user(self, user: CreateUser):
        existing_user = self.repository.get_user_by_email(user.email)
        if existing_user:
             raise HTTPException(status_code=400, detail="Email already registered")
        return self.repository.create_user(user)

    def update_user(self, user: UpdateUser):
        return self.repository.update_user(user)
