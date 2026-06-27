from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape
from pgvector.sqlalchemy import Vector
from app.db.base import Base
from sqlalchemy.orm import relationship

class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(Integer, primary_key=True, index=True)
    citizen_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=True)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    severity = Column(Integer, nullable=True)
    urgency = Column(Integer, nullable=True)
    evidence_score = Column(Float, nullable=True)
    recurrence_count = Column(Integer, default=0)
    
    geom = Column(Geometry(geometry_type='POINT', srid=4326))
    embedding = Column(Vector(768)) # Gemini embeddings: text-embedding-004 is 768 dims
    
    photo_url = Column(String, nullable=True)
    status = Column(String, default="pending") # pending, verified, assigned, resolved, rejected
    score = Column(Float, nullable=True)
    ai_justification = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    citizen = relationship("User", backref="complaints")
    assignments = relationship("Assignment", back_populates="complaint")
    score_overrides = relationship("ScoreOverride", back_populates="complaint")

    @property
    def lat(self) -> float:
        if self.geom is not None:
            return to_shape(self.geom).y
        return 0.0

    @property
    def lng(self) -> float:
        if self.geom is not None:
            return to_shape(self.geom).x
        return 0.0
