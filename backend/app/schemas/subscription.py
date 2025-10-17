from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.subscription import Subscription, UsageLog, Team, TeamMember, Workspace

class SubscriptionBase(BaseModel):
    tier: str = "free"
    status: str = "active"

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    tier: Optional[str] = None
    status: Optional[str] = None
    current_period_end: Optional[datetime] = None
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None

class SubscriptionResponse(SubscriptionBase):
    id: str
    user_id: str
    current_period_end: Optional[datetime] = None
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UsageLogBase(BaseModel):
    action: str
    count: int = 1

class UsageLogCreate(UsageLogBase):
    pass

class UsageLogResponse(UsageLogBase):
    id: str
    user_id: str
    date: datetime

    class Config:
        from_attributes = True

class TeamBase(BaseModel):
    name: str
    max_users: int = 10

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    max_users: Optional[int] = None

class TeamResponse(TeamBase):
    id: str
    owner_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class TeamMemberBase(BaseModel):
    role: str = "member"

class TeamMemberCreate(TeamMemberBase):
    user_id: str

class TeamMemberResponse(TeamMemberBase):
    id: str
    team_id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class WorkspaceBase(BaseModel):
    name: str

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceResponse(WorkspaceBase):
    id: str
    team_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class CheckoutSessionRequest(BaseModel):
    tier: str

class CheckoutSessionResponse(BaseModel):
    checkout_url: str

class PortalSessionResponse(BaseModel):
    portal_url: str

class UsageStatsResponse(BaseModel):
    period: str
    total_requests: int
    total_messages: int
    total_api_calls: int
    daily_breakdown: list
