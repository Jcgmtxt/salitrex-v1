from sqlalchemy.sql.sqltypes import DateTime
from fastapi import APIRouter, Depends, Query, UploadFile, File, Form, HTTPException
from sqlmodel import Session
from typing import List, Optional
from app.core.database import get_db
from app.modules.income.service import IncomeService
from app.modules.income.schemas import IncomeRead, IncomeReadWithDetails, IncomeCreate, IncomeUpdate, IncomeNoteRead, IncomeNoteCreate, PhotoRead
from app.modules.income.models import PhotoCategory
from app.modules.auth.dependencies import get_current_active_user
from app.modules.auth.models import User
from app.core.schemas import PaginatedResponse
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

@router.get("/", response_model=PaginatedResponse[IncomeReadWithDetails])
def list_incomes(
    query: Optional[str] = Query(None, description="Buscar por placa o cliente"),
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    created_by: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = IncomeService(db)
    return service.get_incomes(query=query, offset=offset, limit=limit, created_by=created_by)

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

@router.post("/{income_id}/notes", response_model=IncomeNoteRead)
def add_income_note(
    income_id: int,
    note_in: IncomeNoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    service = IncomeService(db)
    # Check if income exists
    income = service.get_income_by_id(income_id)
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    
    note = service.add_note_to_income(
        income_id=income_id,
        note_text=note_in.note,
        user_id=current_user.id,
        creator_name=current_user.name
    )
    return note

@router.post("/{income_id}/photos", response_model=PhotoRead)
async def add_income_photo(
    income_id: int,
    category: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    service = IncomeService(db)
    try:
        enum_category = PhotoCategory(category)
    except ValueError:
        raise HTTPException(status_code=400, detail="Categoría de foto inválida")
        
    try:
        photo = await service.add_photo_to_income(
            income_id=income_id,
            file=file,
            category=enum_category,
            user_id=current_user.id
        )
        return photo
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
