from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import Session
from typing import List, Optional
from app.core.database import get_db
from app.modules.paint.service import PaintService
from app.modules.paint.schemas import (
    PaintJobRead, PaintJobCreate, 
    PricingCalculation, 
    PaintConfigRead, PaintConfigCreate,
    VehicleSizeAreaRead, VehicleSizeAreaCreate
)
from app.modules.auth.dependencies import get_current_active_user
from app.modules.auth.models import User

router = APIRouter(prefix="/paint", tags=["Paint"])

@router.get("/calculate-price/{car_id}", response_model=PricingCalculation)
def get_price_calculation(car_id: int, db: Session = Depends(get_db)):
    """Get the minimum price calculation for a specific car"""
    service = PaintService(db)
    return service.calculate_min_price(car_id)

@router.post("/jobs", response_model=PaintJobRead)
def create_paint_job(
    job_in: PaintJobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new paint job with margin validation"""
    service = PaintService(db)
    return service.create_paint_job(
        income_id=job_in.income_id,
        paint_type=job_in.paint_type,
        negotiated_price=job_in.negotiated_price,
        current_user_id=current_user.id
    )

# Configuration Endpoints (Admin only ideally, for now open)

@router.post("/config", response_model=PaintConfigRead)
def create_config(config_in: PaintConfigCreate, db: Session = Depends(get_db)):
    from app.modules.paint.models import PaintConfig
    config = PaintConfig(**config_in.model_dump())
    db.add(config)
    db.commit()
    db.refresh(config)
    return config

@router.post("/areas", response_model=VehicleSizeAreaRead)
def create_area_mapping(area_in: VehicleSizeAreaCreate, db: Session = Depends(get_db)):
    from app.modules.paint.models import VehicleSizeArea
    area = VehicleSizeArea(**area_in.model_dump())
    db.add(area)
    db.commit()
    db.refresh(area)
    return area
