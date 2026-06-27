from fastapi import APIRouter
from . import complaints
from . import auth
from . import admin
from . import departments

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(departments.router, prefix="/departments", tags=["departments"])
api_router.include_router(complaints.router, prefix="/complaints", tags=["complaints"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
