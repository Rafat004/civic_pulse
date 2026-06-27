from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.models.user import User
from app.models.settings import SystemSettings
from app.models.score_override import ScoreOverride
from app.models.complaint import Complaint
from app.schemas.settings import SystemSettingsResponse, SystemSettingsUpdate
from app.schemas.score_override import ScoreOverrideResponse
from typing import List

router = APIRouter()

@router.get("/users")
async def get_all_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

@router.get("/settings", response_model=SystemSettingsResponse)
async def get_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SystemSettings).where(SystemSettings.id == 1))
    settings = result.scalars().first()
    if not settings:
        # Create default settings if they don't exist
        settings = SystemSettings(id=1)
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
    return settings

@router.patch("/settings", response_model=SystemSettingsResponse)
async def update_settings(settings_in: SystemSettingsUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SystemSettings).where(SystemSettings.id == 1))
    settings = result.scalars().first()
    if not settings:
        settings = SystemSettings(id=1)
        db.add(settings)
    
    update_data = settings_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
        
    await db.commit()
    await db.refresh(settings)
    return settings

@router.get("/overrides", response_model=List[ScoreOverrideResponse])
async def get_overrides(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ScoreOverride)
        .options(selectinload(ScoreOverride.admin), selectinload(ScoreOverride.complaint))
        .order_by(ScoreOverride.created_at.desc())
    )
    overrides = result.scalars().all()
    
    # Map relationships to schema
    response = []
    for override in overrides:
        override_dict = {
            "id": override.id,
            "complaint_id": override.complaint_id,
            "admin_id": override.admin_id,
            "old_score": override.old_score,
            "new_score": override.new_score,
            "reason": override.reason,
            "created_at": override.created_at,
            "admin_name": override.admin.name if override.admin else "Unknown",
            "complaint_category": override.complaint.category if override.complaint else "Unknown"
        }
        response.append(override_dict)
    return response

