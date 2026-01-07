# Database seeder script
from sqlmodel import Session
from app.core.database import engine
from app.core.security import encode_password
from app.modules.auth.models import User, UserRole


def seed_admin_user():
    """Create default admin user"""
    with Session(engine) as session:
        # Check if admin already exists
        existing_admin = session.query(User).filter(User.email == "admin@salitrex.com").first()

        if existing_admin:
            print("Admin user already exists. Skipping...")
            return

        # Create admin user
        admin_user = User(
            name="Administrator",
            email="admin@salitrex.com",
            hashed_password=encode_password("admin123"),
            role=UserRole.ADMIN,
            is_active=True
        )

        session.add(admin_user)
        session.commit()
        session.refresh(admin_user)

        print("[OK] Admin user created successfully!")
        print(f"  Email: {admin_user.email}")
        print(f"  Password: admin123")
        print(f"  Role: {admin_user.role}")
        print("\nIMPORTANT: Change the admin password after first login!")


def run_seeders():
    """Run all seeders"""
    print("Running database seeders...")
    seed_admin_user()
    print("\nAll seeders completed successfully!")


if __name__ == "__main__":
    run_seeders()
