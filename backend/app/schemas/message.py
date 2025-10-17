from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.message import MessageRole

class MessageCreate(BaseModel):
    content: str
    image_url: Optional[str] = None

class MessageUpdate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: str
    chat_id: str
    role: MessageRole
    content: str
    image_url: Optional[str] = None
    created_at: datetime
    edited_at: Optional[datetime] = None
    is_edited: Optional[bool] = False

    class Config:
        from_attributes = True

class MessageEditResponse(BaseModel):
    id: str
    message_id: str
    previous_content: str
    edited_at: datetime

    class Config:
        from_attributes = True
