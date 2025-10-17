from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.subscription import Subscription, UsageLog
from app.schemas.subscription import (
    SubscriptionResponse, 
    CheckoutSessionRequest, 
    CheckoutSessionResponse,
    PortalSessionResponse,
    UsageStatsResponse
)
from app.services.stripe_service import StripeService
from typing import List
import uuid
from datetime import datetime, timedelta

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

@router.get("/subscription", response_model=SubscriptionResponse)
async def get_current_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's subscription"""
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id
    ).first()
    
    if not subscription:
        # Create default free subscription
        subscription = Subscription(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            tier="free",
            status="active"
        )
        db.add(subscription)
        db.commit()
        db.refresh(subscription)
    
    return subscription

@router.post("/subscription/checkout", response_model=CheckoutSessionResponse)
async def create_checkout(
    request: CheckoutSessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create Stripe checkout session"""
    price_ids = {
        'pro': "price_1234567890",  # TODO: Replace with actual Stripe price IDs
        'team': "price_0987654321"
    }
    
    if request.tier not in price_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid tier"
        )
    
    stripe_service = StripeService()
    session = await stripe_service.create_checkout_session(
        user_id=current_user.id,
        price_id=price_ids[request.tier],
        success_url="http://localhost:3000/subscription/success",
        cancel_url="http://localhost:3000/pricing",
        db=db
    )
    
    return CheckoutSessionResponse(checkout_url=session.url)

@router.post("/subscription/portal", response_model=PortalSessionResponse)
async def create_portal(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create Stripe customer portal session"""
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id
    ).first()
    
    if not subscription or not subscription.stripe_customer_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active subscription found"
        )
    
    stripe_service = StripeService()
    session = await stripe_service.create_portal_session(
        customer_id=subscription.stripe_customer_id
    )
    
    return PortalSessionResponse(portal_url=session.url)

@router.get("/subscription/usage", response_model=UsageStatsResponse)
async def get_usage_stats(
    period: str = "30d",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get usage statistics for current user"""
    # Calculate date range
    end_date = datetime.utcnow()
    if period == "7d":
        start_date = end_date - timedelta(days=7)
    elif period == "30d":
        start_date = end_date - timedelta(days=30)
    elif period == "90d":
        start_date = end_date - timedelta(days=90)
    else:
        start_date = end_date - timedelta(days=30)
    
    # Get usage logs
    usage_logs = db.query(UsageLog).filter(
        UsageLog.user_id == current_user.id,
        UsageLog.date >= start_date,
        UsageLog.date <= end_date
    ).all()
    
    # Calculate totals
    total_requests = sum(log.count for log in usage_logs if log.action == "message")
    total_messages = sum(log.count for log in usage_logs if log.action == "message")
    total_api_calls = sum(log.count for log in usage_logs if log.action == "api_call")
    
    # Daily breakdown
    daily_breakdown = []
    current_date = start_date
    while current_date <= end_date:
        day_logs = [log for log in usage_logs if log.date.date() == current_date.date()]
        daily_requests = sum(log.count for log in day_logs)
        daily_breakdown.append({
            "date": current_date.date().isoformat(),
            "requests": daily_requests
        })
        current_date += timedelta(days=1)
    
    return UsageStatsResponse(
        period=period,
        total_requests=total_requests,
        total_messages=total_messages,
        total_api_calls=total_api_calls,
        daily_breakdown=daily_breakdown
    )

@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    if not sig_header:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing stripe-signature header"
        )
    
    stripe_service = StripeService()
    await stripe_service.handle_webhook(payload, sig_header, db)
    
    return {"status": "success"}
