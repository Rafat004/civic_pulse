from sqlalchemy import Column, Integer, String, JSON
from app.db.base import Base
from sqlalchemy.orm import relationship

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category_mapping = Column(JSON, nullable=True)
    
    assignments = relationship("Assignment", back_populates="department")
