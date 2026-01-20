# Database seeder script
from sqlmodel import Session, select
from app.core.database import engine
from app.core.security import encode_password
from app.modules.auth.models import User, UserRole
from app.modules.paint.models import PaintConfig, VehicleSizeArea
from app.modules.crm.models import VehicleSize
from app.modules.income.models import Income

def seed_admin_user():
    """Create default admin user"""
    with Session(engine) as session:
        # Check if admin already exists
        statement = select(User).where(User.email == "admin@salitrex.com")
        existing_admin = session.exec(statement).first()

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

def seed_paint_config():
    """Create default paint configuration"""
    with Session(engine) as session:
        if session.exec(select(PaintConfig)).first():
            print("Paint config already exists. Skipping...")
            return
        
        config = PaintConfig(price_per_cm2=0.5, min_margin_percent=30.0)
        session.add(config)
        session.commit()
        print("[OK] Default Paint Config created ($0.5/cm2, 30% margin)")

def seed_vehicle_areas():
    """Create default areas for vehicle sizes"""
    with Session(engine) as session:
        if session.exec(select(VehicleSizeArea)).first():
            print("Vehicle areas already exist. Skipping...")
            return
        
        areas = [
            VehicleSizeArea(size=VehicleSize.SMALL, area_cm2=10000.0),
            VehicleSizeArea(size=VehicleSize.MEDIUM, area_cm2=15000.0),
            VehicleSizeArea(size=VehicleSize.LARGE, area_cm2=20000.0),
            VehicleSizeArea(size=VehicleSize.EXTRA_LARGE, area_cm2=30000.0),
        ]
        session.add_all(areas)
        session.commit()
        print("[OK] Vehicle size areas seeded.")

def run_seeders():
    """Run all seeders"""
    print("Running database seeders...")
    seed_admin_user()
    seed_paint_config()
    seed_vehicle_areas()
    print("\nAll seeders completed successfully!")

if __name__ == "__main__":
    run_seeders()
