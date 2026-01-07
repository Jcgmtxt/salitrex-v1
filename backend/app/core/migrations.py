# Database migration script
from sqlmodel import SQLModel
from app.core.database import engine
from app.modules.auth.models import User
from app.modules.crm.models import Client, Cars


def run_migrations():
    """Create all database tables"""
    print("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    print("Database tables created successfully!")


if __name__ == "__main__":
    run_migrations()
