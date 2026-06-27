from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AssignmentBase(BaseModel):
    complaint_id: int
    department_id: int

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentResponse(AssignmentBase):
    id: int
    assigned_at: datetime
    resolved_at: Optional[datetime] = None
    proof_url: Optional[str] = None

    model_config = {"from_attributes": True}
