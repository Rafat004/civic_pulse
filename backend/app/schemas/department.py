from pydantic import BaseModel
from typing import Optional, Dict

class DepartmentBase(BaseModel):
    name: str
    category_mapping: Optional[Dict] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: int

    model_config = {"from_attributes": True}
