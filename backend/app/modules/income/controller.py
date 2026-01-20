from datetime import datetime
from fastapi import APIRouter, Depends, Query, UploadFile, File, Form, HTTPException
from sqlmodel import Session
from typing import List, Optional
from app.core.database import get_db
from app.modules.income.service import IncomeService
from app.modules.income.schemas import IncomeRead, IncomeReadWithDetails, IncomeCreate, IncomeUpdate
from app.modules.income.models import PhotoCategory
from app.modules.auth.dependencies import get_current_active_user
from app.modules.auth.models import User
import json

router = APIRouter(prefix="/income", tags=["Income"])

@router.post("/", response_model=IncomeReadWithDetails)
async def create_income(
    car_id: int = Form(..., description="ID of the vehicle entering the workshop"),
    notes: Optional[str] = Form(None, description="General notes or observations on entry"),
    agreed_exit_date_time: Optional[datetime] = Form(None, description="Agreed delivery date for the client"),
    files: List[UploadFile] = File([], description="Photos of the vehicle at entry"),
    categories: List[str] = Form([], description="Categories for each photo (entry, process, finished, exit)"),
    services: Optional[str] = Form(
        None, 
        description='JSON string for services. Example: {"paint": {"paint_type": "Metallic", "negotiated_price": 450000}}'
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    ## Create a new Vehicle Income (Reception)
    
    This endpoint handles the complete reception of a vehicle:
    1.  **Basic Data**: Car ID, notes, and exit date.
    2.  **Photos**: Upload multiple files to S3.
    3.  **Services (Dispatcher)**: Optionally trigger other modules.
        *   **Paint**: Provide `paint_type` and `negotiated_price`.
    
    **Note on Services**: The `services` field must be a valid JSON string.
    """
    service = IncomeService(db)
    
    # 1. Parse categories string to Enum
    enum_categories = []
    for cat in categories:
        try:
            enum_categories.append(PhotoCategory(cat))
        except ValueError:
            enum_categories.append(PhotoCategory.ENTRY)

    # 2. Parse services JSON if provided
    services_dict = None
    if services:
        try:
            services_dict = json.loads(services)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON format for services field")

    # 3. Reconstruct IncomeCreate schema
    income_in = IncomeCreate(
        car_id=car_id,
        notes=notes,
        agreed_exit_date_time=agreed_exit_date_time
    )

    return await service.create_income(
        income_data=income_in,
        photo_files=files,
        categories=enum_categories,
        services_payload=services_dict,
        user_id=current_user.id
    )

@router.get("/", response_model=List[IncomeReadWithDetails])
def list_incomes(
    skip: int = 0,
    limit: int = 100,
    client_name: Optional[str] = Query(None),
    created_by: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = IncomeService(db)
    return service.get_incomes(skip=skip, limit=limit, client_name=client_name, created_by=created_by)

@router.get("/{income_id}", response_model=IncomeReadWithDetails)
def get_income(income_id: int, db: Session = Depends(get_db)):
    service = IncomeService(db)
    income = service.get_income_by_id(income_id)
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    return income

@router.patch("/{income_id}", response_model=IncomeRead)
def update_income(
    income_id: int, 
    income_in: IncomeUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    service = IncomeService(db)
    income = service.update_income(income_id, income_in, user_id=current_user.id)
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    return income
