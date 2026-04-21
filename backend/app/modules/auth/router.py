from typing import Annotated
from fastapi import APIRouter, Cookie, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel.orm.session import Session
from app.core.config import settings
from app.core.database import get_db
from app.modules.auth.schemas import CreateUser, UpdateUser, AuthResponse, TokenRefreshResponse, UserResponse
from app.modules.auth.services import AuthService
from app.modules.auth.dependencies import get_admin_user, get_current_active_user

router = APIRouter(prefix="/auth", tags=["Auth"])

REFRESH_COOKIE_NAME = "refresh_token"


@router.post("/register", response_model=UserResponse)
def register_user(user: CreateUser, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.register_user(user)


@router.post("/login", response_model=AuthResponse)
def login(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
):

    service = AuthService(db)
    auth_data = service.login(form_data)

    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=auth_data.refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/api/v1/auth",
    )
    return auth_data


@router.post("/refresh", response_model=TokenRefreshResponse)
def refresh_token(
    response: Response,
    db: Session = Depends(get_db),
    refresh_token: str | None = Cookie(default=None, alias=REFRESH_COOKIE_NAME),
):
    """Renueva el access token usando el refresh token de la cookie HTTP-only."""
    if not refresh_token:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token proporcionado",
        )
    service = AuthService(db)
    new_access_token = service.refresh_access_token(refresh_token)
    return TokenRefreshResponse(access_token=new_access_token, token_type="bearer")


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    """Cierra la sesión eliminando la cookie del refresh token."""
    response.delete_cookie(key=REFRESH_COOKIE_NAME, path="/api/v1/auth")


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
