from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "citizen"
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    google_id: str

class LocalUserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "citizen"

class LocalUserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
