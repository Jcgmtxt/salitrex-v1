from app.modules.auth.repository import UserRepository
from app.modules.auth.schemas import CreateUser, UpdateUser, AuthResponse
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.core.config import settings
from fastapi import HTTPException, status
from jose import JWTError, jwt
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
        if not db_user or not verify_password(form_data.password, db_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas",
            )

        token_data = {"sub": db_user.email}
        access_token = create_access_token(data=token_data)
        refresh_token = create_refresh_token(data=token_data)

        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            name=db_user.name,
            email=db_user.email,
            role=db_user.role,
        )

    def refresh_access_token(self, refresh_token: str) -> str:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido o expirado",
        )
        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            if payload.get("type") != "refresh":
                raise credentials_exception
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception

        user = self.repository.get_user_by_email(email)
        if user is None or not user.is_active:
            raise credentials_exception

        return create_access_token(data={"sub": email})

    def get_active_users(
        self,
        query: str | None = None,
        offset: int = 0,
        limit: int = 20
    ) -> dict:
        users, total = self.repository.get_active_users(
            query=query, offset=offset, limit=limit
        )
        return {
            "items": users,
            "total": total,
            "offset": offset,
            "limit": limit
        }

    def update_user(self, id: int, user: UpdateUser):
        return self.repository.update_user(id, user)

    def delete_user(self, user_id: int):
        return self.repository.delete_user(user_id)
