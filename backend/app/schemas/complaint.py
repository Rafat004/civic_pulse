from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Location(BaseModel):
    lat: float
    lng: float

class ComplaintBase(BaseModel):
    title: Optional[str] = None
    description: str
    category: str
    photo_url: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    location: Location

class ComplaintUpdate(BaseModel):
    status: str

class ComplaintResponse(ComplaintBase):
    id: int
    citizen_id: Optional[int]
    severity: Optional[int]
    urgency: Optional[int]
    evidence_score: Optional[float]
    recurrence_count: int
    status: str
    score: Optional[float]
    ai_justification: Optional[str]
    created_at: datetime
    lat: float
    lng: float

    model_config = {"from_attributes": True}
