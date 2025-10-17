from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.message import MessageResponse

class ChatCreate(BaseModel):
    title: str

class ChatUpdate(BaseModel):
    title: Optional[str] = None

class ChatResponse(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: datetime
    message_count: int = 0
    messages: Optional[List[MessageResponse]] = None

    class Config:
        from_attributes = True
