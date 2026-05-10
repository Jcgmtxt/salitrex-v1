from typing import List, Optional
from sqlmodel import Session, select
from sqlalchemy.orm import joinedload
from sqlalchemy import or_
from app.modules.income.models import Income, Photos
from app.modules.income.schemas import IncomeCreate, IncomeUpdate, PhotoCreate
from app.modules.crm.models import Cars, Client

class IncomeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_income(self, income_data: IncomeCreate, user_id: Optional[int] = None) -> Income:
        # Separate photos from income data
        photos_data = income_data.photos
        income_dict = income_data.model_dump(exclude={"photos"})
        
        income = Income(**income_dict)
        if user_id:
            income.created_by = user_id
            income.updated_by = user_id
            
        self.db.add(income)
        self.db.commit()
        self.db.refresh(income)
        
        # Add photos if any
        if photos_data:
            for photo_data in photos_data:
                photo = Photos(**photo_data.model_dump(), income_id=income.id)
                self.db.add(photo)
            self.db.commit()
            self.db.refresh(income)
            
        return income

    def get_income_by_id(self, income_id: int) -> Optional[Income]:
        statement = (
            select(Income)
            .where(Income.id == income_id)
            .options(
                joinedload(Income.photos),
                joinedload(Income.car).joinedload(Cars.client)
            )
        )
        return self.db.exec(statement).first()

    def get_incomes(
        self,
        query: Optional[str] = None,
        offset: int = 0,
        limit: int = 20,
        created_by: Optional[int] = None
    ) -> tuple[List[Income], int]:
        statement = select(Income)

        if query and query.strip():
            statement = statement.join(Cars, Income.car_id == Cars.id).join(Client, Cars.client_id == Client.id)
            q = f"%{query.strip()}%"
            statement = statement.where(
                or_(
                    Client.name.ilike(q),
                    Cars.license_plate.ilike(q)
                )
            )

        if created_by:
            statement = statement.where(Income.created_by == created_by)

        from sqlalchemy import func
        count_stmt = select(func.count()).select_from(statement.subquery())
        total = self.db.exec(count_stmt).one()

        statement = statement.order_by(Income.id.desc()).options(
            joinedload(Income.photos),
            joinedload(Income.car).joinedload(Cars.client)
        ).offset(offset).limit(limit)

        results = self.db.exec(statement).unique().all()
        return results, total

    def update_income(self, income_id: int, income_data: IncomeUpdate, user_id: Optional[int] = None) -> Optional[Income]:
        db_income = self.db.get(Income, income_id)
        if not db_income:
            return None
            
        data = income_data.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(db_income, key, value)
            
        if user_id:
            db_income.updated_by = user_id
            
        self.db.add(db_income)
        self.db.commit()
        self.db.refresh(db_income)
        return db_income

    def add_photos(self, income_id: int, photos_data: List[PhotoCreate]) -> List[Photos]:
        photos = []
        for photo_data in photos_data:
            photo = Photos(**photo_data.model_dump(), income_id=income_id)
            self.db.add(photo)
            photos.append(photo)
        self.db.commit()
        return photos