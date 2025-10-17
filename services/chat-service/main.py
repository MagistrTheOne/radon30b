from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
import os
import json
import time
import logging
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Radon AI Chat Service",
    description="Chat Service для управления чатами и сообщениями",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs
AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8001")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Request models
class ChatCreate(BaseModel):
    title: str
    workspace_id: Optional[str] = None

class ChatUpdate(BaseModel):
    title: str

class MessageCreate(BaseModel):
    content: str
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    personality: str = "helpful"
    enable_functions: bool = True

class MessageUpdate(BaseModel):
    content: str

# Response models
class ChatResponse(BaseModel):
    id: str
    title: str
    user_id: str
    workspace_id: Optional[str] = None
    created_at: str
    message_count: int

class MessageResponse(BaseModel):
    id: str
    chat_id: str
    role: str
    content: str
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    audio_transcription: Optional[str] = None
    audio_duration: Optional[int] = None
    function_calls: Optional[Dict[str, Any]] = None
    personality_used: Optional[str] = None
    conversation_id: Optional[str] = None
    created_at: str
    edited_at: Optional[str] = None
    is_edited: bool

# In-memory storage (in production, use PostgreSQL)
chats_db = {}
messages_db = {}
chat_counter = 0
message_counter = 0

def get_user_id(request: Request) -> str:
    """Extract user ID from request headers"""
    user_id = request.headers.get("X-User-ID")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in headers")
    return user_id

async def publish_event(event_type: str, data: Dict[str, Any]):
    """Publish event to Redis (placeholder)"""
    logger.info(f"Publishing event: {event_type} - {data}")
    # In production, publish to Redis pub/sub

async def call_ai_service(message_data: MessageCreate, conversation_id: Optional[str] = None) -> Dict[str, Any]:
    """Call AI Service for response generation"""
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            request_data = {
                "prompt": message_data.content,
                "max_new_tokens": 2048,
                "temperature": 0.7,
                "personality": message_data.personality,
                "enable_functions": message_data.enable_functions,
                "conversation_id": conversation_id
            }
            
            if message_data.image_url:
                request_data["image_url"] = message_data.image_url
            if message_data.audio_url:
                request_data["audio_url"] = message_data.audio_url
            
            response = await client.post(
                f"{AI_SERVICE_URL}/inference",
                json=request_data
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail="AI Service error")
                
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="AI Service timeout")
    except Exception as e:
        logger.error(f"Error calling AI service: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "chat-service",
        "timestamp": datetime.utcnow().isoformat()
    }

# Chat endpoints
@app.get("/api/chats", response_model=List[ChatResponse])
async def get_chats(request: Request):
    """Get all chats for user"""
    user_id = get_user_id(request)
    
    user_chats = []
    for chat_id, chat in chats_db.items():
        if chat["user_id"] == user_id:
            message_count = len([m for m in messages_db.values() if m["chat_id"] == chat_id])
            user_chats.append(ChatResponse(
                id=chat_id,
                title=chat["title"],
                user_id=chat["user_id"],
                workspace_id=chat.get("workspace_id"),
                created_at=chat["created_at"],
                message_count=message_count
            ))
    
    return sorted(user_chats, key=lambda x: x.created_at, reverse=True)

@app.post("/api/chats", response_model=ChatResponse)
async def create_chat(chat_data: ChatCreate, request: Request):
    """Create new chat"""
    user_id = get_user_id(request)
    
    global chat_counter
    chat_counter += 1
    chat_id = f"chat_{chat_counter}"
    
    chat = {
        "id": chat_id,
        "title": chat_data.title,
        "user_id": user_id,
        "workspace_id": chat_data.workspace_id,
        "created_at": datetime.utcnow().isoformat()
    }
    
    chats_db[chat_id] = chat
    
    # Publish event
    await publish_event("chat.created", {
        "chat_id": chat_id,
        "user_id": user_id,
        "title": chat_data.title
    })
    
    return ChatResponse(
        id=chat_id,
        title=chat["title"],
        user_id=chat["user_id"],
        workspace_id=chat.get("workspace_id"),
        created_at=chat["created_at"],
        message_count=0
    )

@app.get("/api/chats/{chat_id}", response_model=ChatResponse)
async def get_chat(chat_id: str, request: Request):
    """Get specific chat"""
    user_id = get_user_id(request)
    
    if chat_id not in chats_db:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat = chats_db[chat_id]
    if chat["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    message_count = len([m for m in messages_db.values() if m["chat_id"] == chat_id])
    
    return ChatResponse(
        id=chat_id,
        title=chat["title"],
        user_id=chat["user_id"],
        workspace_id=chat.get("workspace_id"),
        created_at=chat["created_at"],
        message_count=message_count
    )

@app.put("/api/chats/{chat_id}", response_model=ChatResponse)
async def update_chat(chat_id: str, chat_data: ChatUpdate, request: Request):
    """Update chat title"""
    user_id = get_user_id(request)
    
    if chat_id not in chats_db:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat = chats_db[chat_id]
    if chat["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    chat["title"] = chat_data.title
    
    # Publish event
    await publish_event("chat.updated", {
        "chat_id": chat_id,
        "user_id": user_id,
        "title": chat_data.title
    })
    
    message_count = len([m for m in messages_db.values() if m["chat_id"] == chat_id])
    
    return ChatResponse(
        id=chat_id,
        title=chat["title"],
        user_id=chat["user_id"],
        workspace_id=chat.get("workspace_id"),
        created_at=chat["created_at"],
        message_count=message_count
    )

@app.delete("/api/chats/{chat_id}")
async def delete_chat(chat_id: str, request: Request):
    """Delete chat"""
    user_id = get_user_id(request)
    
    if chat_id not in chats_db:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat = chats_db[chat_id]
    if chat["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Delete all messages in chat
    messages_to_delete = [msg_id for msg_id, msg in messages_db.items() if msg["chat_id"] == chat_id]
    for msg_id in messages_to_delete:
        del messages_db[msg_id]
    
    # Delete chat
    del chats_db[chat_id]
    
    # Publish event
    await publish_event("chat.deleted", {
        "chat_id": chat_id,
        "user_id": user_id
    })
    
    return {"message": "Chat deleted successfully"}

# Message endpoints
@app.get("/api/chats/{chat_id}/messages", response_model=List[MessageResponse])
async def get_messages(chat_id: str, request: Request):
    """Get messages for chat"""
    user_id = get_user_id(request)
    
    if chat_id not in chats_db:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat = chats_db[chat_id]
    if chat["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    chat_messages = [msg for msg in messages_db.values() if msg["chat_id"] == chat_id]
    chat_messages.sort(key=lambda x: x["created_at"])
    
    return [
        MessageResponse(
            id=msg["id"],
            chat_id=msg["chat_id"],
            role=msg["role"],
            content=msg["content"],
            image_url=msg.get("image_url"),
            audio_url=msg.get("audio_url"),
            audio_transcription=msg.get("audio_transcription"),
            audio_duration=msg.get("audio_duration"),
            function_calls=msg.get("function_calls"),
            personality_used=msg.get("personality_used"),
            conversation_id=msg.get("conversation_id"),
            created_at=msg["created_at"],
            edited_at=msg.get("edited_at"),
            is_edited=msg.get("is_edited", False)
        )
        for msg in chat_messages
    ]

@app.post("/api/chats/{chat_id}/messages", response_model=MessageResponse)
async def create_message(chat_id: str, message_data: MessageCreate, request: Request):
    """Create new message and get AI response"""
    user_id = get_user_id(request)
    
    if chat_id not in chats_db:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat = chats_db[chat_id]
    if chat["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    global message_counter
    
    # Create user message
    message_counter += 1
    user_message_id = f"msg_{message_counter}"
    
    user_message = {
        "id": user_message_id,
        "chat_id": chat_id,
        "role": "user",
        "content": message_data.content,
        "image_url": message_data.image_url,
        "audio_url": message_data.audio_url,
        "created_at": datetime.utcnow().isoformat(),
        "is_edited": False
    }
    
    messages_db[user_message_id] = user_message
    
    # Publish event
    await publish_event("message.sent", {
        "message_id": user_message_id,
        "chat_id": chat_id,
        "user_id": user_id,
        "role": "user"
    })
    
    # Get AI response
    try:
        ai_response = await call_ai_service(message_data)
        
        # Create AI message
        message_counter += 1
        ai_message_id = f"msg_{message_counter}"
        
        ai_message = {
            "id": ai_message_id,
            "chat_id": chat_id,
            "role": "assistant",
            "content": ai_response.get("response", ""),
            "function_calls": ai_response.get("function_calls"),
            "personality_used": ai_response.get("personality_used"),
            "conversation_id": ai_response.get("conversation_id"),
            "created_at": datetime.utcnow().isoformat(),
            "is_edited": False
        }
        
        messages_db[ai_message_id] = ai_message
        
        # Publish event
        await publish_event("message.sent", {
            "message_id": ai_message_id,
            "chat_id": chat_id,
            "user_id": user_id,
            "role": "assistant"
        })
        
        return MessageResponse(
            id=ai_message_id,
            chat_id=ai_message["chat_id"],
            role=ai_message["role"],
            content=ai_message["content"],
            function_calls=ai_message.get("function_calls"),
            personality_used=ai_message.get("personality_used"),
            conversation_id=ai_message.get("conversation_id"),
            created_at=ai_message["created_at"],
            is_edited=ai_message["is_edited"]
        )
        
    except Exception as e:
        logger.error(f"Error getting AI response: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get AI response")

@app.put("/api/chats/{chat_id}/messages/{message_id}", response_model=MessageResponse)
async def update_message(chat_id: str, message_id: str, message_data: MessageUpdate, request: Request):
    """Update message"""
    user_id = get_user_id(request)
    
    if chat_id not in chats_db:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat = chats_db[chat_id]
    if chat["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if message_id not in messages_db:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message = messages_db[message_id]
    if message["chat_id"] != chat_id:
        raise HTTPException(status_code=404, detail="Message not found in this chat")
    
    # Update message
    message["content"] = message_data.content
    message["edited_at"] = datetime.utcnow().isoformat()
    message["is_edited"] = True
    
    # Publish event
    await publish_event("message.updated", {
        "message_id": message_id,
        "chat_id": chat_id,
        "user_id": user_id
    })
    
    return MessageResponse(
        id=message["id"],
        chat_id=message["chat_id"],
        role=message["role"],
        content=message["content"],
        image_url=message.get("image_url"),
        audio_url=message.get("audio_url"),
        audio_transcription=message.get("audio_transcription"),
        audio_duration=message.get("audio_duration"),
        function_calls=message.get("function_calls"),
        personality_used=message.get("personality_used"),
        conversation_id=message.get("conversation_id"),
        created_at=message["created_at"],
        edited_at=message.get("edited_at"),
        is_edited=message["is_edited"]
    )

@app.delete("/api/chats/{chat_id}/messages/{message_id}")
async def delete_message(chat_id: str, message_id: str, request: Request):
    """Delete message"""
    user_id = get_user_id(request)
    
    if chat_id not in chats_db:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat = chats_db[chat_id]
    if chat["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if message_id not in messages_db:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message = messages_db[message_id]
    if message["chat_id"] != chat_id:
        raise HTTPException(status_code=404, detail="Message not found in this chat")
    
    # Delete message
    del messages_db[message_id]
    
    # Publish event
    await publish_event("message.deleted", {
        "message_id": message_id,
        "chat_id": chat_id,
        "user_id": user_id
    })
    
    return {"message": "Message deleted successfully"}

@app.get("/")
async def root():
    return {
        "message": "Radon AI Chat Service",
        "version": "2.0.0",
        "status": "running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )
