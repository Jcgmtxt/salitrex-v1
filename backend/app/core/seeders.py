# Database seeder script
from sqlmodel import Session, select, func
from app.core.database import engine
from app.core.security import encode_password
from app.modules.auth.models import User, UserRole
from app.modules.paint.models import PaintConfig, VehicleSizeArea
from app.modules.crm.models import VehicleSize, Client, Cars, DocumentType
from app.modules.income.models import Income
import random

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

def seed_clients_and_cars():
    """Create 20 sample clients with some cars"""
    with Session(engine) as session:
        admin = session.exec(select(User).where(User.email == "admin@salitrex.com")).first()
        admin_id = admin.id if admin else None

        names = [
            "Juan Pérez", "María García", "Carlos Rodríguez", "Ana Martínez", 
            "Luis López", "Elena González", "Diego Hernández", "Sofía Díaz",
            "Andrés Moreno", "Paula Muñoz", "Gabriel Castro", "Isabel Romero",
            "Fernando Ruiz", "Lucía Navarro", "Ricardo Morales", "Marta Castillo",
            "Javier Ortega", "Silvia Sánchez", "Oscar Delgado", "Valentina Vega"
        ]
        
        doc_types = list(DocumentType)
        brands = ["Toyota", "Mazda", "Chevrolet", "Renault", "Nissan", "Kia", "Hyundai"]
        models = ["Corolla", "CX-5", "Onix", "Logan", "Versa", "Rio", "Tucson"]
        colors = ["Blanco", "Negro", "Gris", "Rojo", "Azul", "Plata"]
        sizes = list(VehicleSize)

        print(f"Seeding 20 clients...")
        for i in range(20):
            # Generate a unique-ish identity number
            identity = f"{random.randint(1000000, 999999999)}"
            
            # Check if exists
            if session.exec(select(Client).where(Client.identity_number == identity)).first():
                continue

            client = Client(
                name=names[i],
                document_type=random.choice(doc_types),
                identity_number=identity,
                email=f"client{random.randint(1000, 9999)}@example.com",
                phone=f"310{random.randint(1000000, 9999999)}",
                created_by=admin_id
            )
            session.add(client)
            session.commit()
            session.refresh(client)
            
            # Add 0-2 cars for each client
            num_cars = random.randint(0, 2)
            for _ in range(num_cars):
                car = Cars(
                    client_id=client.id,
                    license_plate=f"{chr(random.randint(65, 90))}{chr(random.randint(65, 90))}{chr(random.randint(65, 90))}{random.randint(100, 999)}",
                    brand=random.choice(brands),
                    model=random.choice(models),
                    year=random.randint(2010, 2024),
                    color=random.choice(colors),
                    size=random.choice(sizes),
                    created_by=admin_id
                )
                session.add(car)
            
        session.commit()
        print(f"[OK] 20 clients and their cars seeded.")

def run_seeders():
    """Run all seeders"""
    print("Running database seeders...")
    seed_paint_config()
    seed_vehicle_areas()
    seed_clients_and_cars()
    print("\nAll seeders completed successfully!")

if __name__ == "__main__":
    run_seeders()
