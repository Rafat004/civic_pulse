from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ScoreOverrideCreate(BaseModel):
    new_score: float
    reason: str

class ScoreOverrideResponse(BaseModel):
    id: int
    complaint_id: int
    admin_id: int
    old_score: float
    new_score: float
    reason: str
    created_at: datetime
    
    admin_name: Optional[str] = None
    complaint_category: Optional[str] = None
    
    class Config:
        from_attributes = True
