from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import time
import logging
from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Radon AI Subscription Service",
    description="Subscription Service для управления подписками и биллингом",
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

# Stripe configuration
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# Request models
class CheckoutRequest(BaseModel):
    tier: str  # free, pro, enterprise

class UsageStatsRequest(BaseModel):
    period: str = "30d"  # 7d, 30d, 90d

# Response models
class SubscriptionResponse(BaseModel):
    id: str
    user_id: str
    tier: str
    status: str
    current_period_end: Optional[str] = None
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None
    created_at: str
    updated_at: str

class UsageStatsResponse(BaseModel):
    messages_used: int
    messages_limit: int
    tokens_used: int
    tokens_limit: int
    last_reset: str
    tier: str
    period: Dict[str, str]

class CheckoutResponse(BaseModel):
    checkout_url: str

class PortalResponse(BaseModel):
    portal_url: str

# In-memory storage (in production, use PostgreSQL)
subscriptions_db = {}
usage_logs_db = {}

# Subscription limits
SUBSCRIPTION_LIMITS = {
    "free": {
        "messages_per_month": 100,
        "tokens_per_month": 100000,
        "features": ["basic_chat", "limited_history"]
    },
    "pro": {
        "messages_per_month": 1000,
        "tokens_per_month": 1000000,
        "features": ["unlimited_chat", "full_history", "priority_support"]
    },
    "enterprise": {
        "messages_per_month": -1,  # unlimited
        "tokens_per_month": -1,    # unlimited
        "features": ["unlimited_chat", "full_history", "priority_support", "custom_integrations", "dedicated_support"]
    }
}

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

def get_subscription_limits(tier: str) -> Dict[str, Any]:
    """Get subscription limits for tier"""
    return SUBSCRIPTION_LIMITS.get(tier, SUBSCRIPTION_LIMITS["free"])

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "subscription-service",
        "timestamp": datetime.utcnow().isoformat()
    }

# Subscription endpoints
@app.get("/api/subscription", response_model=SubscriptionResponse)
async def get_subscription(request: Request):
    """Get current subscription"""
    user_id = get_user_id(request)
    
    if user_id not in subscriptions_db:
        # Create default free subscription
        subscription_id = f"sub_{user_id}"
        subscriptions_db[user_id] = {
            "id": subscription_id,
            "user_id": user_id,
            "tier": "free",
            "status": "active",
            "current_period_end": None,
            "stripe_customer_id": None,
            "stripe_subscription_id": None,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
    
    subscription = subscriptions_db[user_id]
    
    return SubscriptionResponse(
        id=subscription["id"],
        user_id=subscription["user_id"],
        tier=subscription["tier"],
        status=subscription["status"],
        current_period_end=subscription.get("current_period_end"),
        stripe_customer_id=subscription.get("stripe_customer_id"),
        stripe_subscription_id=subscription.get("stripe_subscription_id"),
        created_at=subscription["created_at"],
        updated_at=subscription["updated_at"]
    )

@app.post("/api/subscription", response_model=SubscriptionResponse)
async def create_subscription(subscription_data: dict, request: Request):
    """Create or update subscription"""
    user_id = get_user_id(request)
    
    tier = subscription_data.get("tier", "free")
    stripe_customer_id = subscription_data.get("stripe_customer_id")
    stripe_subscription_id = subscription_data.get("stripe_subscription_id")
    current_period_end = subscription_data.get("current_period_end")
    
    subscription_id = f"sub_{user_id}"
    
    subscription = {
        "id": subscription_id,
        "user_id": user_id,
        "tier": tier,
        "status": "active",
        "current_period_end": current_period_end,
        "stripe_customer_id": stripe_customer_id,
        "stripe_subscription_id": stripe_subscription_id,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    subscriptions_db[user_id] = subscription
    
    # Publish event
    await publish_event("subscription.created", {
        "user_id": user_id,
        "tier": tier,
        "subscription_id": subscription_id
    })
    
    return SubscriptionResponse(**subscription)

@app.post("/api/subscription/checkout", response_model=CheckoutResponse)
async def create_checkout_session(checkout_data: CheckoutRequest, request: Request):
    """Create Stripe checkout session"""
    user_id = get_user_id(request)
    tier = checkout_data.tier
    
    # In production, create actual Stripe checkout session
    # For now, return a mock URL
    checkout_url = f"https://checkout.stripe.com/mock/{tier}_{user_id}"
    
    return CheckoutResponse(checkout_url=checkout_url)

@app.post("/api/subscription/portal", response_model=PortalResponse)
async def create_portal_session(request: Request):
    """Create Stripe customer portal session"""
    user_id = get_user_id(request)
    
    # In production, create actual Stripe portal session
    # For now, return a mock URL
    portal_url = f"https://billing.stripe.com/mock/{user_id}"
    
    return PortalResponse(portal_url=portal_url)

# Usage endpoints
@app.get("/api/usage", response_model=UsageStatsResponse)
async def get_usage_stats(request: Request, period: str = "30d"):
    """Get usage statistics"""
    user_id = get_user_id(request)
    
    # Get subscription
    subscription = subscriptions_db.get(user_id, {"tier": "free"})
    tier = subscription["tier"]
    limits = get_subscription_limits(tier)
    
    # Calculate period dates
    now = datetime.utcnow()
    if period == "7d":
        start_date = now - timedelta(days=7)
    elif period == "30d":
        start_date = now - timedelta(days=30)
    elif period == "90d":
        start_date = now - timedelta(days=90)
    else:
        start_date = now - timedelta(days=30)
    
    # Get usage logs for period
    user_usage = usage_logs_db.get(user_id, [])
    period_usage = [
        log for log in user_usage
        if datetime.fromisoformat(log["date"]) >= start_date
    ]
    
    # Calculate totals
    messages_used = sum(log["count"] for log in period_usage if log["action"] == "message")
    tokens_used = sum(log["count"] for log in period_usage if log["action"] == "token")
    
    return UsageStatsResponse(
        messages_used=messages_used,
        messages_limit=limits["messages_per_month"],
        tokens_used=tokens_used,
        tokens_limit=limits["tokens_per_month"],
        last_reset=start_date.isoformat(),
        tier=tier,
        period={
            "start": start_date.isoformat(),
            "end": now.isoformat()
        }
    )

@app.post("/api/usage")
async def log_usage(usage_data: dict, request: Request):
    """Log usage for user"""
    user_id = get_user_id(request)
    
    action = usage_data.get("action", "message")
    count = usage_data.get("count", 1)
    
    # Create usage log entry
    usage_log = {
        "id": f"usage_{user_id}_{int(time.time())}",
        "user_id": user_id,
        "action": action,
        "count": count,
        "date": datetime.utcnow().isoformat()
    }
    
    if user_id not in usage_logs_db:
        usage_logs_db[user_id] = []
    
    usage_logs_db[user_id].append(usage_log)
    
    # Publish event
    await publish_event("usage.logged", {
        "user_id": user_id,
        "action": action,
        "count": count
    })
    
    return {"status": "success", "usage_log": usage_log}

# Admin endpoints
@app.get("/api/admin/stats")
async def get_admin_stats(request: Request):
    """Get admin statistics"""
    user_id = get_user_id(request)
    
    # In production, check if user is admin
    # For now, return stats for all users
    
    total_users = len(subscriptions_db)
    total_teams = 0  # Placeholder
    active_subscriptions = len([s for s in subscriptions_db.values() if s["status"] == "active"])
    total_messages = sum(len(logs) for logs in usage_logs_db.values())
    total_chats = 0  # Placeholder
    
    # Subscription breakdown
    subscription_breakdown = {}
    for subscription in subscriptions_db.values():
        tier = subscription["tier"]
        subscription_breakdown[tier] = subscription_breakdown.get(tier, 0) + 1
    
    # Calculate growth (mock data)
    monthly_growth = 12.5  # Placeholder
    daily_active_users = len(usage_logs_db)  # Users with usage logs
    
    return {
        "total_users": total_users,
        "total_teams": total_teams,
        "total_revenue": 0,  # Placeholder
        "active_subscriptions": active_subscriptions,
        "daily_active_users": daily_active_users,
        "monthly_growth": monthly_growth,
        "total_messages": total_messages,
        "total_chats": total_chats,
        "subscription_breakdown": subscription_breakdown
    }

# Stripe webhook endpoint
@app.post("/api/webhooks/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    try:
        body = await request.json()
        event_type = body.get("type")
        data = body.get("data", {}).get("object", {})
        
        if event_type == "customer.subscription.created":
            customer_id = data.get("customer")
            subscription_id = data.get("id")
            status = data.get("status")
            current_period_end = data.get("current_period_end")
            
            # Find user by Stripe customer ID
            user_id = None
            for uid, subscription in subscriptions_db.items():
                if subscription.get("stripe_customer_id") == customer_id:
                    user_id = uid
                    break
            
            if user_id:
                subscriptions_db[user_id].update({
                    "stripe_subscription_id": subscription_id,
                    "status": status,
                    "current_period_end": datetime.fromtimestamp(current_period_end).isoformat() if current_period_end else None,
                    "updated_at": datetime.utcnow().isoformat()
                })
                
                # Publish event
                await publish_event("subscription.created", {
                    "user_id": user_id,
                    "subscription_id": subscription_id,
                    "status": status
                })
                
                logger.info(f"Subscription created: {user_id} - {subscription_id}")
        
        elif event_type == "customer.subscription.updated":
            subscription_id = data.get("id")
            status = data.get("status")
            current_period_end = data.get("current_period_end")
            
            # Find user by subscription ID
            user_id = None
            for uid, subscription in subscriptions_db.items():
                if subscription.get("stripe_subscription_id") == subscription_id:
                    user_id = uid
                    break
            
            if user_id:
                subscriptions_db[user_id].update({
                    "status": status,
                    "current_period_end": datetime.fromtimestamp(current_period_end).isoformat() if current_period_end else None,
                    "updated_at": datetime.utcnow().isoformat()
                })
                
                # Publish event
                await publish_event("subscription.updated", {
                    "user_id": user_id,
                    "subscription_id": subscription_id,
                    "status": status
                })
                
                logger.info(f"Subscription updated: {user_id} - {subscription_id}")
        
        elif event_type == "customer.subscription.deleted":
            subscription_id = data.get("id")
            
            # Find user by subscription ID
            user_id = None
            for uid, subscription in subscriptions_db.items():
                if subscription.get("stripe_subscription_id") == subscription_id:
                    user_id = uid
                    break
            
            if user_id:
                subscriptions_db[user_id].update({
                    "status": "cancelled",
                    "updated_at": datetime.utcnow().isoformat()
                })
                
                # Publish event
                await publish_event("subscription.deleted", {
                    "user_id": user_id,
                    "subscription_id": subscription_id
                })
                
                logger.info(f"Subscription deleted: {user_id} - {subscription_id}")
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"Error processing Stripe webhook: {str(e)}")
        raise HTTPException(status_code=500, detail="Webhook processing error")

@app.get("/")
async def root():
    return {
        "message": "Radon AI Subscription Service",
        "version": "2.0.0",
        "status": "running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8004,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )
