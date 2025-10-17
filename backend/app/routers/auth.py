from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, SubscriptionTier
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from typing import List

router = APIRouter()

@router.post("/users", response_model=UserResponse)
async def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.clerk_id == user_data.clerk_id).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    
    # Create new user
    db_user = User(
        clerk_id=user_data.clerk_id,
        email=user_data.email,
        subscription_tier=user_data.subscription_tier
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.get("/users/{clerk_id}", response_model=UserResponse)
async def get_user(clerk_id: str, db: Session = Depends(get_db)):
    """Get user by Clerk ID"""
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/users/{clerk_id}", response_model=UserResponse)
async def update_user(
    clerk_id: str, 
    user_data: UserUpdate, 
    db: Session = Depends(get_db)
):
    """Update user information"""
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields
    if user_data.email is not None:
        user.email = user_data.email
    if user_data.subscription_tier is not None:
        user.subscription_tier = user_data.subscription_tier
    
    db.commit()
    db.refresh(user)
    
    return user

@router.delete("/users/{clerk_id}")
async def delete_user(clerk_id: str, db: Session = Depends(get_db)):
    """Delete user and all associated data"""
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}
