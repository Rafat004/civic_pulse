from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from app.db.base import Base
from sqlalchemy.orm import relationship

class Assignment(Base):
    __tablename__ = "assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    proof_url = Column(String, nullable=True)
    
    complaint = relationship("Complaint", back_populates="assignments")
    department = relationship("Department", back_populates="assignments")
