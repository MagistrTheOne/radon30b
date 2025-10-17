from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.message import MessageRole

class MessageCreate(BaseModel):
    content: str
    image_url: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    chat_id: str
    role: MessageRole
    content: str
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
