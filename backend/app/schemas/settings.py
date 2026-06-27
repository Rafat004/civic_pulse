from pydantic import BaseModel

class SystemSettingsBase(BaseModel):
    auto_assign: bool
    smart_deduplication: bool
    ai_confidence_threshold: int
    email_alerts: bool
    sms_alerts: bool
    require_2fa: bool
    session_timeout: int

class SystemSettingsCreate(SystemSettingsBase):
    pass

class SystemSettingsUpdate(SystemSettingsBase):
    pass

class SystemSettingsResponse(SystemSettingsBase):
    id: int

    class Config:
        from_attributes = True
