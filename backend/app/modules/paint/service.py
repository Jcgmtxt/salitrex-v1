from typing import Optional, List
from sqlmodel import Session, select
from app.modules.paint.models import PaintJob, PaintConfig, VehicleSizeArea
from app.modules.crm.models import Cars
from app.modules.income.models import Income
from fastapi import HTTPException

class PaintService:
    def __init__(self, db: Session):
        self.db = db

    def get_active_config(self) -> PaintConfig:
        statement = select(PaintConfig).where(PaintConfig.is_active == True).order_by(PaintConfig.created_at.desc())
        config = self.db.exec(statement).first()
        if not config:
            # Fallback for dev if no config is in DB yet
            return PaintConfig(price_per_cm2=1.0, min_margin_percent=30.0, target_margin_percent=40.0)
        return config

    def calculate_min_price(self, car_id: int) -> dict:
        """Calculates the minimum allowed price based on car size and config"""
        car = self.db.get(Cars, car_id)
        if not car:
            raise HTTPException(status_code=404, detail="Car not found")

        # Get area for car size
        area_statement = select(VehicleSizeArea).where(VehicleSizeArea.size == car.size)
        size_area = self.db.exec(area_statement).first()
        
        if not size_area:
            # Default areas if not configured
            default_areas = {
                "small": 10000.0,
                "medium": 15000.0,
                "large": 20000.0,
                "extra_large": 25000.0
            }
            area_cm2 = default_areas.get(car.size.value, 15000.0)
        else:
            area_cm2 = size_area.area_cm2

        config = self.get_active_config()
        
        base_price = area_cm2 * config.price_per_cm2
        min_allowed_price = base_price * (1 + (config.min_margin_percent / 100))
        target_allowed_price = base_price * (1 + (config.target_margin_percent / 100))

        return {
            "car_size": car.size,
            "area_cm2": area_cm2,
            "price_per_cm2": config.price_per_cm2,
            "base_price": base_price,
            "min_allowed_price": min_allowed_price,
            "min_margin_percent": config.min_margin_percent,
            "target_allowed_price": target_allowed_price,
            "target_margin_percent": config.target_margin_percent
        }

    def create_paint_job(self, income_id: int, paint_type: str, negotiated_price: float, current_user_id: int) -> PaintJob:
        # 1. Get income and car info
        income = self.db.get(Income, income_id)
        if not income:
            raise HTTPException(status_code=404, detail="Income record not found")

        # 2. Calculate minimum price
        calc = self.calculate_min_price(income.car_id)
        
        # 3. Validate margin
        if negotiated_price < calc["min_allowed_price"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Price too low. Minimum allowed price including {calc['min_margin_percent']}% margin is {calc['min_allowed_price']:.2f}"
            )

        # 4. Create Job
        margin_percent = (negotiated_price / calc["base_price"] - 1) * 100
        
        job = PaintJob(
            income_id=income_id,
            paint_type=paint_type,
            base_price=calc["base_price"],
            negotiated_price=negotiated_price,
            margin_percent=margin_percent,
            created_by=current_user_id
        )
        
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job
