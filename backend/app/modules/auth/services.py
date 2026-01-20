from app.modules.auth.repository import UserRepository
from app.modules.auth.schemas import CreateUser, UpdateUser, AuthResponse
from app.core.security import verify_password, create_access_token
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

    def login(self, form_data):
        db_user = self.repository.get_user_by_email(form_data.username)
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

    def get_active_users(self):
        return self.repository.get_active_users()

    def update_user(self, id: int, user: UpdateUser):
        return self.repository.update_user(id, user)

    def delete_user(self, user_id: int):
        return self.repository.delete_user(user_id)
