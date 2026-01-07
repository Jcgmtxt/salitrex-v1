from app.modules.crm.schemas import ClientCreate, ClientResponse, ClientUpdate, CarCreate, CarResponse, CarUpdate
from app.modules.crm.repository import CRMRepository
from typing import List
from fastapi import HTTPException

class CRMService:
    def __init__(self, repository: CRMRepository):
        self.repository = repository

    # --- Client ---

    #crear
    def register_client(self, client: ClientCreate) -> ClientResponse:
        existing_client = self.repository.get_client_by_identity_number(client.identity_number)

        if existing_client:
            raise HTTPException(status_code=400, detail="Client already exists")

        return self.repository.create_client(client)

    #leer
    def get_client(self, client_id: int) -> ClientResponse:
        client = self.repository.get_client_by_id(client_id)

        if not client:
            raise HTTPException(status_code=404, detail="Client not found")

        return client

    def get_clients(self) -> List[ClientResponse]:
        clients = self.repository.get_clients()

        if not clients:
            return []

        return clients

    def search_clients(self, query: str) -> List[ClientResponse]:
        if not query or len(query.strip()) < 1:
            return []
            
        return self.repository.search_clients(query.strip())

    def update_client(self, client_id: int, client_data: ClientUpdate) -> ClientResponse:
        updated_client = self.repository.update_client(client_id, client_data)

        if not updated_client:
            raise HTTPException(status_code=404, detail="Client not found")

        return updated_client

    def delete_client(self, client_id: int) -> None:
        client = self.repository.get_client_by_id(client_id)

        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
            
        if client.cars and len(client.cars) > 0:
             raise HTTPException(status_code=400, detail="Cannot delete client with registered cars")

        return self.repository.delete_client(client)

    # --- Car ---

    #crear
    def register_car(self, car: CarCreate) -> CarResponse:
        existing_car = self.repository.get_car_by_plate(car.license_plate)

        if existing_car:
            raise HTTPException(status_code=400, detail="Car already exists")

        return self.repository.create_car(car)

    #leer
    def get_car(self, car_id: int) -> CarResponse:
        # We need a get_car_by_id in repo, or use existing ones. 
        # Repository doesn't have get_car_by_id yet, let's assume it does or use get_car_by_plate if needed.
        # Actually, let's fix repo later if it's missing.
        car = self.repository.get_car_by_id(car_id)

        if not car:
            raise HTTPException(status_code=404, detail="Car not found")

        return car

    def get_cars(self) -> List[CarResponse]:
        cars = self.repository.get_cars()

        if not cars:
            return []

        return cars

    def update_car(self, car_id: int, car_data: CarUpdate) -> CarResponse:
        updated_car = self.repository.update_car(car_id, car_data)

        if not updated_car:
            raise HTTPException(status_code=404, detail="Car not found")

        return updated_car

    def delete_car(self, car_id: int) -> None:
        car = self.repository.get_car_by_id(car_id)

        if not car:
            raise HTTPException(status_code=404, detail="Car not found")

        return self.repository.delete_car(car)


