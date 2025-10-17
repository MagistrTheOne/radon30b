from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import time
import logging
from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Radon AI User Service",
    description="User Service для управления пользователями и профилями",
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

# Request models
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    image_url: Optional[str] = None

class SettingsUpdate(BaseModel):
    theme: Optional[str] = None
    language: Optional[str] = None
    notifications: Optional[Dict[str, bool]] = None
    privacy: Optional[Dict[str, Any]] = None
    ai: Optional[Dict[str, Any]] = None

# Response models
class ProfileResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    image_url: Optional[str] = None
    subscription: str
    created_at: str
    updated_at: str

class SettingsResponse(BaseModel):
    theme: str
    language: str
    notifications: Dict[str, bool]
    privacy: Dict[str, Any]
    ai: Dict[str, Any]

# In-memory storage (in production, use PostgreSQL)
users_db = {}
settings_db = {}

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

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "user-service",
        "timestamp": datetime.utcnow().isoformat()
    }

# Profile endpoints
@app.get("/api/profile", response_model=ProfileResponse)
async def get_profile(request: Request):
    """Get user profile"""
    user_id = get_user_id(request)
    
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    
    return ProfileResponse(
        id=user["id"],
        email=user["email"],
        name=user.get("name"),
        image_url=user.get("image_url"),
        subscription=user.get("subscription", "free"),
        created_at=user["created_at"],
        updated_at=user["updated_at"]
    )

@app.put("/api/profile", response_model=ProfileResponse)
async def update_profile(profile_data: ProfileUpdate, request: Request):
    """Update user profile"""
    user_id = get_user_id(request)
    
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    
    # Update profile fields
    if profile_data.name is not None:
        user["name"] = profile_data.name
    if profile_data.image_url is not None:
        user["image_url"] = profile_data.image_url
    
    user["updated_at"] = datetime.utcnow().isoformat()
    
    # Publish event
    await publish_event("user.updated", {
        "user_id": user_id,
        "name": user.get("name"),
        "image_url": user.get("image_url")
    })
    
    return ProfileResponse(
        id=user["id"],
        email=user["email"],
        name=user.get("name"),
        image_url=user.get("image_url"),
        subscription=user.get("subscription", "free"),
        created_at=user["created_at"],
        updated_at=user["updated_at"]
    )

@app.delete("/api/profile")
async def delete_profile(request: Request):
    """Delete user profile"""
    user_id = get_user_id(request)
    
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete user data
    del users_db[user_id]
    if user_id in settings_db:
        del settings_db[user_id]
    
    # Publish event
    await publish_event("user.deleted", {
        "user_id": user_id
    })
    
    return {"message": "Profile deleted successfully"}

# Settings endpoints
@app.get("/api/settings", response_model=SettingsResponse)
async def get_settings(request: Request):
    """Get user settings"""
    user_id = get_user_id(request)
    
    if user_id not in settings_db:
        # Return default settings
        default_settings = {
            "theme": "dark",
            "language": "ru",
            "notifications": {
                "email": True,
                "push": True,
                "sound": True
            },
            "privacy": {
                "profileVisibility": "private",
                "dataSharing": False
            },
            "ai": {
                "personality": "helpful",
                "maxTokens": 2048,
                "streaming": True
            }
        }
        return SettingsResponse(**default_settings)
    
    settings = settings_db[user_id]
    return SettingsResponse(**settings)

@app.put("/api/settings", response_model=SettingsResponse)
async def update_settings(settings_data: SettingsUpdate, request: Request):
    """Update user settings"""
    user_id = get_user_id(request)
    
    # Get current settings or create default
    if user_id not in settings_db:
        current_settings = {
            "theme": "dark",
            "language": "ru",
            "notifications": {
                "email": True,
                "push": True,
                "sound": True
            },
            "privacy": {
                "profileVisibility": "private",
                "dataSharing": False
            },
            "ai": {
                "personality": "helpful",
                "maxTokens": 2048,
                "streaming": True
            }
        }
    else:
        current_settings = settings_db[user_id].copy()
    
    # Update settings
    if settings_data.theme is not None:
        current_settings["theme"] = settings_data.theme
    if settings_data.language is not None:
        current_settings["language"] = settings_data.language
    if settings_data.notifications is not None:
        current_settings["notifications"].update(settings_data.notifications)
    if settings_data.privacy is not None:
        current_settings["privacy"].update(settings_data.privacy)
    if settings_data.ai is not None:
        current_settings["ai"].update(settings_data.ai)
    
    settings_db[user_id] = current_settings
    
    # Publish event
    await publish_event("user.settings.updated", {
        "user_id": user_id,
        "settings": current_settings
    })
    
    return SettingsResponse(**current_settings)

# Clerk webhook endpoint
@app.post("/api/webhooks/clerk")
async def clerk_webhook(request: Request):
    """Handle Clerk webhook events"""
    try:
        body = await request.json()
        event_type = body.get("type")
        data = body.get("data", {})
        
        if event_type == "user.created":
            user_id = data.get("id")
            email = data.get("email_addresses", [{}])[0].get("email_address")
            
            if user_id and email:
                users_db[user_id] = {
                    "id": user_id,
                    "email": email,
                    "name": None,
                    "image_url": None,
                    "subscription": "free",
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                }
                
                # Publish event
                await publish_event("user.created", {
                    "user_id": user_id,
                    "email": email
                })
                
                logger.info(f"User created: {user_id} - {email}")
        
        elif event_type == "user.updated":
            user_id = data.get("id")
            email = data.get("email_addresses", [{}])[0].get("email_address")
            
            if user_id in users_db:
                users_db[user_id]["email"] = email
                users_db[user_id]["updated_at"] = datetime.utcnow().isoformat()
                
                # Publish event
                await publish_event("user.updated", {
                    "user_id": user_id,
                    "email": email
                })
                
                logger.info(f"User updated: {user_id} - {email}")
        
        elif event_type == "user.deleted":
            user_id = data.get("id")
            
            if user_id in users_db:
                del users_db[user_id]
                if user_id in settings_db:
                    del settings_db[user_id]
                
                # Publish event
                await publish_event("user.deleted", {
                    "user_id": user_id
                })
                
                logger.info(f"User deleted: {user_id}")
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"Error processing Clerk webhook: {str(e)}")
        raise HTTPException(status_code=500, detail="Webhook processing error")

# Admin endpoints
@app.get("/api/admin/users")
async def get_all_users(request: Request):
    """Get all users (admin only)"""
    user_id = get_user_id(request)
    
    # In production, check if user is admin
    # For now, return all users
    
    users_list = []
    for uid, user in users_db.items():
        users_list.append({
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name"),
            "subscription": user.get("subscription", "free"),
            "created_at": user["created_at"],
            "updated_at": user["updated_at"]
        })
    
    return {
        "users": users_list,
        "total": len(users_list)
    }

@app.get("/")
async def root():
    return {
        "message": "Radon AI User Service",
        "version": "2.0.0",
        "status": "running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8003,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )
