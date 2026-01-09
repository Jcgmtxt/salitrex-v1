from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field, Field, field_validator
from typing import Literal, List
import secrets
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "Salitrex"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    
    # Database settings - SIN valores por defecto sensibles
    DB_CONNECTION: str = "postgresql"
    DB_HOST: str
    DB_PORT: int = 5432
    DB_DATABASE: str
    DB_USERNAME: str
    DB_PASSWORD: str  # Sin valor por defecto
    
    # JWT Settings - REQUERIDOS en producción
    SECRET_KEY: str = Field(
        default_factory=lambda: secrets.token_urlsafe(32) if __name__ == "__main__" else None
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Security
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    CORS_ORIGINS: List[str] = []
    
    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
    
    @field_validator("ALLOWED_HOSTS", mode="before")
    @classmethod
    def parse_allowed_hosts(cls, v):
        """Parsea ALLOWED_HOSTS desde string JSON o lista"""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # Soporte para formato separado por comas: "host1,host2"
                return [host.strip() for host in v.split(",") if host.strip()]
        return v
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parsea CORS_ORIGINS desde string JSON o lista"""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # Soporte para formato separado por comas: "origin1,origin2"
                return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    
    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str, info) -> str:
        """Asegura que SECRET_KEY sea fuerte en producción"""
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