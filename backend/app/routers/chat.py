from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models.user import User
from app.models.chat import Chat
from app.models.message import Message, MessageRole
from app.schemas.chat import ChatCreate, ChatResponse, ChatUpdate
from app.schemas.message import MessageCreate, MessageResponse
from app.services.ai_service import AIService
from typing import List
import json
import uuid
from datetime import datetime

router = APIRouter()

# Dependency to get current user (mock for now)
async def get_current_user(clerk_id: str = "mock_user_id", db: Session = Depends(get_db)):
    """Get current user from Clerk ID"""
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not user:
        # Create mock user for development
        user = User(
            id=str(uuid.uuid4()),
            clerk_id=clerk_id,
            email="dev@radonai.com",
            subscription_tier="free"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.post("/chats/new", response_model=ChatResponse)
async def create_chat(
    chat_data: ChatCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new chat"""
    chat = Chat(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        title=chat_data.title
    )
    
    db.add(chat)
    db.commit()
    db.refresh(chat)
    
    return ChatResponse(
        id=chat.id,
        user_id=chat.user_id,
        title=chat.title,
        created_at=chat.created_at,
        message_count=0
    )

@router.get("/chats", response_model=List[ChatResponse])
async def get_chats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all chats for current user"""
    chats = db.query(Chat).filter(
        Chat.user_id == current_user.id
    ).order_by(desc(Chat.created_at)).all()
    
    return [
        ChatResponse(
            id=chat.id,
            user_id=chat.user_id,
            title=chat.title,
            created_at=chat.created_at,
            message_count=len(chat.messages)
        )
        for chat in chats
    ]

@router.get("/chats/{chat_id}", response_model=ChatResponse)
async def get_chat(
    chat_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific chat with messages"""
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    messages = [
        MessageResponse(
            id=msg.id,
            chat_id=msg.chat_id,
            role=msg.role,
            content=msg.content,
            image_url=msg.image_url,
            created_at=msg.created_at
        )
        for msg in chat.messages
    ]
    
    return ChatResponse(
        id=chat.id,
        user_id=chat.user_id,
        title=chat.title,
        created_at=chat.created_at,
        message_count=len(chat.messages),
        messages=messages
    )

@router.put("/chats/{chat_id}", response_model=ChatResponse)
async def update_chat(
    chat_id: str,
    chat_data: ChatUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update chat title"""
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    if chat_data.title is not None:
        chat.title = chat_data.title
    
    db.commit()
    db.refresh(chat)
    
    return ChatResponse(
        id=chat.id,
        user_id=chat.user_id,
        title=chat.title,
        created_at=chat.created_at,
        message_count=len(chat.messages)
    )

@router.delete("/chats/{chat_id}")
async def delete_chat(
    chat_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete chat and all messages"""
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    db.delete(chat)
    db.commit()
    
    return {"message": "Chat deleted successfully"}

@router.post("/chats/{chat_id}/messages", response_model=MessageResponse)
async def send_message(
    chat_id: str,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message to chat"""
    # Verify chat exists and belongs to user
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    # Create user message
    user_message = Message(
        id=str(uuid.uuid4()),
        chat_id=chat_id,
        role=MessageRole.USER,
        content=message_data.content,
        image_url=message_data.image_url
    )
    
    db.add(user_message)
    db.commit()
    db.refresh(user_message)
    
    # Generate AI response
    ai_service = AIService()
    ai_response = await ai_service.generate_response(
        message_data.content,
        image_url=message_data.image_url
    )
    
    # Create AI message
    ai_message = Message(
        id=str(uuid.uuid4()),
        chat_id=chat_id,
        role=MessageRole.ASSISTANT,
        content=ai_response
    )
    
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)
    
    return MessageResponse(
        id=ai_message.id,
        chat_id=ai_message.chat_id,
        role=ai_message.role,
        content=ai_message.content,
        image_url=ai_message.image_url,
        created_at=ai_message.created_at
    )

@router.post("/chats/{chat_id}/stream")
async def stream_message(
    chat_id: str,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Stream AI response for a message"""
    # Verify chat exists and belongs to user
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    # Create user message
    user_message = Message(
        id=str(uuid.uuid4()),
        chat_id=chat_id,
        role=MessageRole.USER,
        content=message_data.content,
        image_url=message_data.image_url
    )
    
    db.add(user_message)
    db.commit()
    
    async def generate_stream():
        """Generate streaming response"""
        try:
            ai_service = AIService()
            full_response = ""
            
            async for chunk in ai_service.generate_stream_response(
                message_data.content,
                image_url=message_data.image_url
            ):
                full_response += chunk
                yield f"data: {json.dumps({'content': chunk, 'done': False})}\n\n"
            
            # Save final AI message
            ai_message = Message(
                id=str(uuid.uuid4()),
                chat_id=chat_id,
                role=MessageRole.ASSISTANT,
                content=full_response
            )
            
            db.add(ai_message)
            db.commit()
            
            yield f"data: {json.dumps({'content': '', 'done': True, 'message_id': ai_message.id})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )
