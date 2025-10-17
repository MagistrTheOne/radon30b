from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import SubscriptionTier

class UserCreate(BaseModel):
    clerk_id: str
    email: EmailStr
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    subscription_tier: Optional[SubscriptionTier] = None

class UserResponse(BaseModel):
    id: str
    clerk_id: str
    email: str
    subscription_tier: SubscriptionTier
    created_at: datetime

    class Config:
        from_attributes = True
