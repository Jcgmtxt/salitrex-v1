from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from app.core.database import get_db
from app.modules.crm.services import CRMService
from app.modules.crm.repository import CRMRepository
from app.modules.crm.schemas import ClientCreate, ClientUpdate, ClientResponse, CarCreate, CarUpdate, CarResponse
from app.core.schemas import PaginatedResponse
from typing import List, Optional
from app.modules.auth.dependencies import get_current_active_user, get_admin_user

router = APIRouter(prefix="/crm", dependencies=[Depends(get_current_active_user)])

def get_crm_service(db: Session = Depends(get_db)) -> CRMService:
    repository = CRMRepository(db)
    return CRMService(repository)

# --- Clients ---
@router.post("/clients", response_model=ClientResponse, tags=["Clients"])
def create_client(client: ClientCreate, service: CRMService = Depends(get_crm_service)):
    return service.register_client(client)

@router.get("/clients", response_model=PaginatedResponse[ClientResponse], tags=["Clients"])
def get_clients(
    query: Optional[str] = Query(None, description="Buscar por nombre, cédula o teléfono"),
    offset: int = Query(0, ge=0, description="Registros a saltar"),
    limit: int = Query(20, ge=1, le=100, description="Máximo de registros"),
    service: CRMService = Depends(get_crm_service),
):
    return service.get_clients(query=query, offset=offset, limit=limit)

@router.get("/clients/{client_id}", response_model=ClientResponse, tags=["Clients"])
def get_client(client_id: int, service: CRMService = Depends(get_crm_service)):
    return service.get_client(client_id)

@router.put("/clients/{client_id}", response_model=ClientResponse, tags=["Clients"])
def update_client(client_id: int, client: ClientUpdate, service: CRMService = Depends(get_crm_service)):
    return service.update_client(client_id, client)

@router.delete("/clients/{client_id}", tags=["Clients"], dependencies=[Depends(get_admin_user)])
def delete_client(client_id: int, service: CRMService = Depends(get_crm_service)):
    service.delete_client(client_id)
    return {"message": "Client deleted successfully"}

# --- Cars ---

@router.post("/cars", response_model=CarResponse, tags=["Cars"])
def create_car(car: CarCreate, service: CRMService = Depends(get_crm_service)):
    return service.register_car(car)

@router.get("/cars", response_model=PaginatedResponse[CarResponse], tags=["Cars"])
def get_cars(
    query: Optional[str] = Query(None, description="Buscar por placa, marca o modelo"),
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    service: CRMService = Depends(get_crm_service)
):
    return service.get_cars(query=query, offset=offset, limit=limit)

@router.get("/cars/{car_id}", response_model=CarResponse, tags=["Cars"])
def get_car(car_id: int, service: CRMService = Depends(get_crm_service)):
    return service.get_car(car_id)

@router.put("/cars/{car_id}", response_model=CarResponse, tags=["Cars"])
def update_car(car_id: int, car: CarUpdate, service: CRMService = Depends(get_crm_service)):
    return service.update_car(car_id, car)

@router.delete("/cars/{car_id}", tags=["Cars"], dependencies=[Depends(get_admin_user)])
def delete_car(car_id: int, service: CRMService = Depends(get_crm_service)):
    service.delete_car(car_id)
    return {"message": "Car deleted successfully"}


