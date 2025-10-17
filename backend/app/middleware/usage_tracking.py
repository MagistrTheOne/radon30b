from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.subscription import Subscription, UsageLog
from sqlalchemy import func
from datetime import datetime
from typing import Optional
import uuid

async def track_usage(
    user: User,
    action: str,
    db: Session
) -> None:
    """Track user usage"""
    today = datetime.utcnow().date()
    
    usage_log = db.query(UsageLog).filter(
        UsageLog.user_id == user.id,
        UsageLog.action == action,
        func.date(UsageLog.date) == today
    ).first()
    
    if usage_log:
        usage_log.count += 1
    else:
        usage_log = UsageLog(
            id=str(uuid.uuid4()),
            user_id=user.id,
            action=action,
            count=1
        )
        db.add(usage_log)
    
    db.commit()

async def check_rate_limit(
    user: User,
    action: str,
    db: Session
) -> bool:
    """Check if user has exceeded rate limit"""
    subscription = db.query(Subscription).filter(
        Subscription.user_id == user.id
    ).first()
    
    if not subscription:
        # Default to free tier limits
        tier = "free"
    else:
        tier = subscription.tier
    
    limits = {
        'free': {'message': 10, 'api_call': 100},
        'pro': {'message': -1, 'api_call': 10000},  # -1 = unlimited
        'team': {'message': -1, 'api_call': 100000},
        'enterprise': {'message': -1, 'api_call': -1}
    }
    
    limit = limits.get(tier, limits['free']).get(action, 0)
    
    if limit == -1:
        return True
    
    today = datetime.utcnow().date()
    usage = db.query(func.sum(UsageLog.count)).filter(
        UsageLog.user_id == user.id,
        UsageLog.action == action,
        func.date(UsageLog.date) == today
    ).scalar() or 0
    
    return usage < limit

async def get_usage_stats(
    user: User,
    action: str,
    db: Session
) -> dict:
    """Get current usage statistics for user"""
    today = datetime.utcnow().date()
    
    usage = db.query(func.sum(UsageLog.count)).filter(
        UsageLog.user_id == user.id,
        UsageLog.action == action,
        func.date(UsageLog.date) == today
    ).scalar() or 0
    
    subscription = db.query(Subscription).filter(
        Subscription.user_id == user.id
    ).first()
    
    if not subscription:
        tier = "free"
    else:
        tier = subscription.tier
    
    limits = {
        'free': {'message': 10, 'api_call': 100},
        'pro': {'message': -1, 'api_call': 10000},
        'team': {'message': -1, 'api_call': 100000},
        'enterprise': {'message': -1, 'api_call': -1}
    }
    
    limit = limits.get(tier, limits['free']).get(action, 0)
    
    return {
        'usage': usage,
        'limit': limit,
        'tier': tier,
        'unlimited': limit == -1,
        'percentage': (usage / limit * 100) if limit > 0 else 0
    }
