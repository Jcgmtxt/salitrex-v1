from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field, Field, field_validator
from typing import Literal, List, Any, Union
import secrets
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "Salitrex"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    
    DB_CONNECTION: str = "postgresql"
    DB_HOST: str
    DB_PORT: int = 5432
    DB_DATABASE: str
    DB_USERNAME: str
    DB_PASSWORD: str
    
    SECRET_KEY: str = Field(
        default_factory=lambda: secrets.token_urlsafe(32) if __name__ == "__main__" else None
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    ALLOWED_HOSTS: Union[List[str], str] = ["localhost", "127.0.0.1"]
    CORS_ORIGINS: Union[List[str], str] = []

    # AWS S3 Settings
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET: Optional[str] = None
    
    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
    
    @field_validator("ALLOWED_HOSTS", mode="before")
    @classmethod
    def parse_allowed_hosts(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [host.strip() for host in v.split(",") if host.strip()]
        return v
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    
    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str, info) -> str:
        if info.data.get("ENVIRONMENT") == "production":
            if not v or len(v) < 32:
                raise ValueError(
                    "SECRET_KEY debe tener al menos 32 caracteres en producción"
                )
        return v
    
    @field_validator("DB_PASSWORD")
    @classmethod
    def validate_db_password(cls, v: str, info) -> str:
        """Valida contraseña en producción"""
        if info.data.get("ENVIRONMENT") == "production":
            if not v or len(v) < 8:
                raise ValueError(
                    "DB_PASSWORD debe estar configurada en producción"
                )
        return v
    
    @computed_field
    @property
    def DATABASE_URL(self) -> str:
        """Construye la URL sin exponerla directamente"""
        if self.DB_CONNECTION == "sqlite":
            return f"sqlite:///{self.DB_DATABASE}"
        
        return (
            f"{self.DB_CONNECTION}://{self.DB_USERNAME}:"
            f"{self.DB_PASSWORD}@{self.DB_HOST}:"
            f"{self.DB_PORT}/{self.DB_DATABASE}"
        )
    
    @property
    def DATABASE_URL_SAFE(self) -> str:
        return (
            f"{self.DB_CONNECTION}://{self.DB_USERNAME}:***@"
            f"{self.DB_HOST}:{self.DB_PORT}/{self.DB_DATABASE}"
        )

settings = Settings()