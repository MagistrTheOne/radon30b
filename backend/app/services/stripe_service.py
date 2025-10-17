import stripe
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.subscription import Subscription
from app.schemas.subscription import SubscriptionCreate, SubscriptionUpdate
import uuid
from datetime import datetime

class StripeService:
    def __init__(self):
        stripe.api_key = "sk_test_..."  # TODO: Move to settings
    
    async def create_checkout_session(
        self,
        user_id: str,
        price_id: str,
        success_url: str,
        cancel_url: str,
        db: Session
    ) -> Dict[str, Any]:
        """Create Stripe checkout session for subscription"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        session = stripe.checkout.Session.create(
            customer_email=user.email,
            payment_method_types=['card'],
            line_items=[{'price': price_id, 'quantity': 1}],
            mode='subscription',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={'user_id': user_id}
        )
        return session
    
    async def create_portal_session(self, customer_id: str) -> Dict[str, Any]:
        """Create customer portal for managing subscription"""
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url="http://localhost:3000/settings"  # TODO: Move to settings
        )
        return session
    
    async def handle_webhook(self, payload: bytes, sig_header: str, db: Session) -> None:
        """Handle Stripe webhooks"""
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, "whsec_..."  # TODO: Move to settings
            )
        except ValueError:
            raise ValueError("Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise ValueError("Invalid signature")
        
        if event['type'] == 'checkout.session.completed':
            await self._handle_checkout_completed(event['data']['object'], db)
        elif event['type'] == 'customer.subscription.updated':
            await self._handle_subscription_updated(event['data']['object'], db)
        elif event['type'] == 'customer.subscription.deleted':
            await self._handle_subscription_deleted(event['data']['object'], db)
    
    async def _handle_checkout_completed(self, session: Dict[str, Any], db: Session) -> None:
        """Handle successful checkout"""
        user_id = session['metadata']['user_id']
        customer_id = session['customer']
        subscription_id = session['subscription']
        
        # Get subscription details from Stripe
        stripe_subscription = stripe.Subscription.retrieve(subscription_id)
        
        # Create or update subscription in database
        subscription = db.query(Subscription).filter(Subscription.user_id == user_id).first()
        
        if subscription:
            subscription.stripe_customer_id = customer_id
            subscription.stripe_subscription_id = subscription_id
            subscription.status = "active"
            subscription.current_period_end = datetime.fromtimestamp(
                stripe_subscription.current_period_end
            )
            subscription.updated_at = datetime.utcnow()
        else:
            subscription = Subscription(
                id=str(uuid.uuid4()),
                user_id=user_id,
                tier="pro",  # TODO: Determine tier from price_id
                status="active",
                stripe_customer_id=customer_id,
                stripe_subscription_id=subscription_id,
                current_period_end=datetime.fromtimestamp(
                    stripe_subscription.current_period_end
                )
            )
            db.add(subscription)
        
        db.commit()
    
    async def _handle_subscription_updated(self, subscription: Dict[str, Any], db: Session) -> None:
        """Handle subscription update"""
        stripe_subscription_id = subscription['id']
        db_subscription = db.query(Subscription).filter(
            Subscription.stripe_subscription_id == stripe_subscription_id
        ).first()
        
        if db_subscription:
            db_subscription.status = subscription['status']
            db_subscription.current_period_end = datetime.fromtimestamp(
                subscription['current_period_end']
            )
            db_subscription.updated_at = datetime.utcnow()
            db.commit()
    
    async def _handle_subscription_deleted(self, subscription: Dict[str, Any], db: Session) -> None:
        """Handle subscription cancellation"""
        stripe_subscription_id = subscription['id']
        db_subscription = db.query(Subscription).filter(
            Subscription.stripe_subscription_id == stripe_subscription_id
        ).first()
        
        if db_subscription:
            db_subscription.status = "cancelled"
            db_subscription.updated_at = datetime.utcnow()
            db.commit()
