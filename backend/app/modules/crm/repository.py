from typing import List, Optional
from sqlmodel import Session, select
from sqlalchemy.orm import joinedload
from app.modules.crm.models import Client, Cars
from app.modules.crm.schemas import ClientCreate, CarCreate, ClientUpdate, CarUpdate
from sqlalchemy import or_, desc, case


class CRMRepository:
    def __init__(self, db: Session):
        self.db = db

    # --- CLIENTS ---
    def create_client(self, client_data: ClientCreate, user_id: Optional[int] = None) -> Client:
        client = Client.model_validate(client_data)
        if user_id:
            client.created_by = user_id
            client.updated_by = user_id
        self.db.add(client)
        self.db.commit()
        self.db.refresh(client)
        return client

    def update_client(self, client_id: int, client_data: ClientUpdate) -> Client:
        db_client = self.db.get(Client, client_id)
        if not db_client:
            return None
        
        data = client_data.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(db_client, key, value)
        
        self.db.add(db_client)
        self.db.commit()
        self.db.refresh(db_client)
        return db_client

    def get_client_by_id(self, client_id: int) -> Optional[Client]:
        # Eager load cars for this client to avoid N+1
        statement = select(Client).where(Client.id == client_id).options(joinedload(Client.cars))
        return self.db.exec(statement).first()

    def get_client_by_identity_number(self, client_identity_number: str) -> Optional[Client]:
        statement = select(Client).where(Client.identity_number == client_identity_number)
        return self.db.exec(statement).first()

    def get_clients(self, skip: int = 0, limit: int = 100) -> List[Client]:
        statement = select(Client).offset(skip).limit(limit)
        return self.db.exec(statement).all()

    def search_clients(self, query: str) -> List[Client]:
        query_str = f"%{query}%"
        
        # Define ranking logic
        # 1. Exact match on Identity or Phone (Highest Priority)
        # 2. Name starts with Query
        # 3. Contains Query (Lowest Priority - default match)
        rank_score = case(
            (Client.identity_number == query, 3),
            (Client.phone == query, 3),
            (Client.name.ilike(f"{query}%"), 2),
            else_=1
        )

        statement = (
            select(Client)
            .where(
                or_(
                    Client.name.ilike(query_str),
                    Client.identity_number.ilike(query_str),
                    Client.phone.ilike(query_str)
                )
            )
            .order_by(desc(rank_score), Client.name)
        )
        
        return self.db.exec(statement).all()

    def delete_client(self, client: Client) -> None:
        self.db.delete(client)
        self.db.commit()

    # --- CARS ---
    def create_car(self, car_data: CarCreate, user_id: Optional[int] = None) -> Cars:
        car = Cars.model_validate(car_data)
        if user_id:
            car.created_by = user_id
            car.updated_by = user_id
        self.db.add(car)
        self.db.commit()
        self.db.refresh(car)
        return car

    def update_car(self, car_id: int, car_data: CarUpdate) -> Cars:
        db_car = self.db.get(Cars, car_id)
        if not db_car:
            return None
            
        data = car_data.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(db_car, key, value)
            
        self.db.add(db_car)
        self.db.commit()
        self.db.refresh(db_car)
        return db_car

    def get_car_by_plate(self, plate: str) -> Optional[Cars]:
        # Eager load the owner (client)
        statement = select(Cars).where(Cars.license_plate == plate).options(joinedload(Cars.client))
        return self.db.exec(statement).first()

    def get_cars(self, skip: int = 0, limit: int = 100) -> List[Cars]:
        # Eager load clients for all cars efficiently
        statement = select(Cars).options(joinedload(Cars.client)).offset(skip).limit(limit)
        return self.db.exec(statement).all()
    def get_car_by_id(self, car_id: int) -> Optional[Cars]:
        statement = select(Cars).where(Cars.id == car_id).options(joinedload(Cars.client))
        return self.db.exec(statement).first()

    def delete_car(self, car: Cars) -> None:
        self.db.delete(car)
        self.db.commit()
