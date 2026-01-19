from sqlalchemy.sql.sqltypes import DateTime
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
    car_id: int = Form(...),
    notes: Optional[str] = Form(None),
    agreed_exit_date_time: Optional[str] = Form(None), # Simplified as string for Form
    files: List[UploadFile] = File([]),
    categories: List[str] = Form([]), # Pass as list of strings "entry", "process", etc.
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    service = IncomeService(db)
    
    # Parse categories string to Enum
    enum_categories = []
    for cat in categories:
        try:
            enum_categories.append(PhotoCategory(cat))
        except ValueError:
            enum_categories.append(PhotoCategory.ENTRY)

    # Reconstruct IncomeCreate schema from Form data
    income_in = IncomeCreate(
        car_id=car_id,
        notes=notes,
        agreed_exit_date_time=agreed_exit_date_time
    )

    return await service.create_income(
        income_data=income_in,
        photo_files=files,
        categories=enum_categories,
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
