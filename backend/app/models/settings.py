from sqlalchemy import Column, Integer, Boolean
from app.db.base import Base

class SystemSettings(Base):
    __tablename__ = "system_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    auto_assign = Column(Boolean, default=True, nullable=False)
    smart_deduplication = Column(Boolean, default=True, nullable=False)
    ai_confidence_threshold = Column(Integer, default=85, nullable=False)
    email_alerts = Column(Boolean, default=True, nullable=False)
    sms_alerts = Column(Boolean, default=False, nullable=False)
    require_2fa = Column(Boolean, default=False, nullable=False)
    session_timeout = Column(Integer, default=60, nullable=False)
