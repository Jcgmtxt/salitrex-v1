import sys
import os
from datetime import datetime, timedelta
import random

# Add project root to sys.path so we can import app modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from sqlmodel import Session, select
from app.core.database import engine
from app.modules.crm.models import Cars
from app.modules.income.models import Income
from app.modules.auth.models import User
from app.core.seeders import run_seeders

def seed_incomes():
    with Session(engine) as session:
        # Check if we have an admin user
        admin = session.exec(select(User).where(User.email == "admin@salitrex.com")).first()
        if not admin:
            # Need to run seeders first to create admin and cars/clients
            print("No admin user found. Running base seeders first...")
            run_seeders()
            admin = session.exec(select(User).where(User.email == "admin@salitrex.com")).first()

        admin_id = admin.id if admin else None

        # Fetch all cars
        cars = session.exec(select(Cars)).all()
        if not cars:
            print("No cars found in database. Running base seeders first...")
            run_seeders()
            cars = session.exec(select(Cars)).all()

        if not cars:
            print("[ERROR] No cars found even after seeding clients and cars.")
            return

        # Notes list for mock income entries
        sample_notes = [
            "Golpe leve en puerta trasera derecha, requiere pintura y latonería.",
            "Revisión de pintura general. Rayón en capó.",
            "Golpe en guardabarros izquierdo delantero, requiere enderezado y pintura.",
            "Mantenimiento general. Detalle estético en parachoques trasero.",
            "Pintura completa del techo debido a quemadura solar.",
            "Rayones menores en ambas puertas del lado derecho.",
            "Reconstrucción y pintura de espejo retrovisor izquierdo.",
            "Repintado de rines y pulido general de carrocería."
        ]

        print(f"Encontrados {len(cars)} vehículos. Creando entradas de servicio...")

        count = 0
        for car in cars:
            # Decidir si crear 0, 1 o 2 entradas para este carro
            num_entries = random.choice([1, 2])
            for i in range(num_entries):
                # Generar fecha de entrada en los últimos 30 días
                days_ago = random.randint(1, 30)
                income_date = datetime.now() - timedelta(days=days_ago, hours=random.randint(0, 12))
                
                # Salida acordada: 2 a 5 días después de la entrada
                agreed_exit = income_date + timedelta(days=random.randint(2, 5))
                
                # Decidir si el vehículo ya salió/se entregó
                # (Más probable para ingresos más antiguos)
                is_delivered = days_ago > 5 and random.choice([True, False])
                exit_date = agreed_exit - timedelta(hours=random.randint(1, 6)) if is_delivered else None

                notes = random.choice(sample_notes) if random.choice([True, False]) else "Revisión general de carrocería."

                income = Income(
                    car_id=car.id,
                    income_date_time=income_date,
                    agreed_exit_date_time=agreed_exit,
                    exit_date_time=exit_date,
                    notes=notes,
                    created_by=admin_id,
                    updated_by=admin_id,
                    created_at=income_date,
                    updated_at=income_date
                )
                session.add(income)
                count += 1

        session.commit()
        print(f"[OK] Se crearon con éxito {count} entradas de servicio (incomes) en la base de datos.")

if __name__ == "__main__":
    seed_incomes()
