from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.department import Department
from pydantic import BaseModel

router = APIRouter()

class DepartmentCreate(BaseModel):
    name: str
    category_mapping: dict = {}

@router.get("/")
async def list_departments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Department))
    departments = result.scalars().all()
    return departments

@router.post("/")
async def create_department(dept: DepartmentCreate, db: AsyncSession = Depends(get_db)):
    new_dept = Department(name=dept.name, category_mapping=dept.category_mapping)
    db.add(new_dept)
    await db.commit()
    await db.refresh(new_dept)
    return new_dept
