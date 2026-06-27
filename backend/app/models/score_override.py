from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from app.db.base import Base
from sqlalchemy.orm import relationship

class ScoreOverride(Base):
    __tablename__ = "score_overrides"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"))
    admin_id = Column(Integer, ForeignKey("users.id"))
    old_score = Column(Float, nullable=False)
    new_score = Column(Float, nullable=False)
    reason = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    complaint = relationship("Complaint", back_populates="score_overrides")
    admin = relationship("User")
