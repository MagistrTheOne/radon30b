from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import httpx
import os
import time
import logging
from typing import Optional
import jwt
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Radon AI API Gateway",
    description="API Gateway для микросервисной архитектуры Radon AI",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://radonai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*.vercel.app"]
)

# Service URLs from environment
SERVICE_URLS = {
    "chat": os.getenv("CHAT_SERVICE_URL", "http://localhost:8002"),
    "ai": os.getenv("AI_SERVICE_URL", "http://localhost:8001"),
    "user": os.getenv("USER_SERVICE_URL", "http://localhost:8003"),
    "subscription": os.getenv("SUBSCRIPTION_SERVICE_URL", "http://localhost:8004"),
    "file": os.getenv("FILE_SERVICE_URL", "http://localhost:8005"),
}

# Rate limiting storage (in production, use Redis)
rate_limit_storage = {}

# Clerk JWT validation
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

async def verify_clerk_token(authorization: str = None) -> dict:
    """Verify Clerk JWT token and return user data"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.split(" ")[1]
    
    try:
        # In production, verify JWT with Clerk's public key
        # For now, we'll decode without verification for development
        payload = jwt.decode(token, options={"verify_signature": False})
        
        # Extract user information
        user_data = {
            "user_id": payload.get("sub"),
            "email": payload.get("email"),
            "session_id": payload.get("sid")
        }
        
        return user_data
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def check_rate_limit(user_id: str, endpoint: str) -> bool:
    """Check if user has exceeded rate limit"""
    key = f"{user_id}:{endpoint}"
    current_time = time.time()
    
    # Clean old entries
    rate_limit_storage = {k: v for k, v in rate_limit_storage.items() 
                         if current_time - v["last_request"] < 3600}  # 1 hour window
    
    if key in rate_limit_storage:
        user_data = rate_limit_storage[key]
        if user_data["count"] >= 100:  # 100 requests per hour
            return False
        user_data["count"] += 1
        user_data["last_request"] = current_time
    else:
        rate_limit_storage[key] = {
            "count": 1,
            "last_request": current_time
        }
    
    return True

async def forward_request(
    service_name: str,
    path: str,
    method: str,
    request: Request,
    user_data: dict = None
) -> JSONResponse:
    """Forward request to appropriate microservice"""
    
    if service_name not in SERVICE_URLS:
        raise HTTPException(status_code=404, detail=f"Service {service_name} not found")
    
    service_url = SERVICE_URLS[service_name]
    target_url = f"{service_url}{path}"
    
    # Check rate limit
    if user_data:
        if not await check_rate_limit(user_data["user_id"], f"{service_name}:{path}"):
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
    
    # Prepare headers
    headers = dict(request.headers)
    if user_data:
        headers["X-User-ID"] = user_data["user_id"]
        headers["X-User-Email"] = user_data["email"]
    
    # Remove host header to avoid conflicts
    headers.pop("host", None)
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Get request body
            body = await request.body()
            
            # Forward request
            response = await client.request(
                method=method,
                url=target_url,
                headers=headers,
                content=body,
                params=request.query_params
            )
            
            # Return response
            return JSONResponse(
                content=response.json() if response.headers.get("content-type", "").startswith("application/json") else {"data": response.text},
                status_code=response.status_code,
                headers=dict(response.headers)
            )
            
    except httpx.TimeoutException:
        logger.error(f"Timeout forwarding request to {service_name}: {target_url}")
        raise HTTPException(status_code=504, detail="Service timeout")
    except httpx.ConnectError:
        logger.error(f"Connection error forwarding request to {service_name}: {target_url}")
        raise HTTPException(status_code=503, detail="Service unavailable")
    except Exception as e:
        logger.error(f"Error forwarding request to {service_name}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check for API Gateway"""
    services_status = {}
    
    for service_name, service_url in SERVICE_URLS.items():
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{service_url}/health")
                services_status[service_name] = "healthy" if response.status_code == 200 else "unhealthy"
        except:
            services_status[service_name] = "unhealthy"
    
    overall_status = "healthy" if all(status == "healthy" for status in services_status.values()) else "degraded"
    
    return {
        "status": overall_status,
        "services": services_status,
        "timestamp": datetime.utcnow().isoformat()
    }

# Chat service routes
@app.api_route("/api/chats/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def chat_routes(path: str, request: Request, authorization: str = None):
    """Route chat requests to Chat Service"""
    user_data = await verify_clerk_token(authorization)
    return await forward_request("chat", f"/api/chats/{path}", request.method, request, user_data)

# AI service routes
@app.api_route("/api/ai/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def ai_routes(path: str, request: Request, authorization: str = None):
    """Route AI requests to AI Service"""
    user_data = await verify_clerk_token(authorization)
    return await forward_request("ai", f"/api/ai/{path}", request.method, request, user_data)

# User service routes
@app.api_route("/api/users/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def user_routes(path: str, request: Request, authorization: str = None):
    """Route user requests to User Service"""
    user_data = await verify_clerk_token(authorization)
    return await forward_request("user", f"/api/users/{path}", request.method, request, user_data)

# Subscription service routes
@app.api_route("/api/subscriptions/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def subscription_routes(path: str, request: Request, authorization: str = None):
    """Route subscription requests to Subscription Service"""
    user_data = await verify_clerk_token(authorization)
    return await forward_request("subscription", f"/api/subscriptions/{path}", request.method, request, user_data)

# File service routes
@app.api_route("/api/files/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def file_routes(path: str, request: Request, authorization: str = None):
    """Route file requests to File Service"""
    user_data = await verify_clerk_token(authorization)
    return await forward_request("file", f"/api/files/{path}", request.method, request, user_data)

# Profile routes (redirect to user service)
@app.api_route("/api/profile/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def profile_routes(path: str, request: Request, authorization: str = None):
    """Route profile requests to User Service"""
    user_data = await verify_clerk_token(authorization)
    return await forward_request("user", f"/api/profile/{path}", request.method, request, user_data)

# Settings routes (redirect to user service)
@app.api_route("/api/settings/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def settings_routes(path: str, request: Request, authorization: str = None):
    """Route settings requests to User Service"""
    user_data = await verify_clerk_token(authorization)
    return await forward_request("user", f"/api/settings/{path}", request.method, request, user_data)

# Upload routes (redirect to file service)
@app.api_route("/api/upload/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def upload_routes(path: str, request: Request, authorization: str = None):
    """Route upload requests to File Service"""
    user_data = await verify_clerk_token(authorization)
    return await forward_request("file", f"/api/upload/{path}", request.method, request, user_data)

# Usage routes (redirect to subscription service)
@app.api_route("/api/usage/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def usage_routes(path: str, request: Request, authorization: str = None):
    """Route usage requests to Subscription Service"""
    user_data = await verify_clerk_token(authorization)
    return await forward_request("subscription", f"/api/usage/{path}", request.method, request, user_data)

# Admin routes (redirect to appropriate service)
@app.api_route("/api/admin/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def admin_routes(path: str, request: Request, authorization: str = None):
    """Route admin requests to appropriate service"""
    user_data = await verify_clerk_token(authorization)
    
    # Route admin stats to subscription service
    if path.startswith("stats"):
        return await forward_request("subscription", f"/api/admin/{path}", request.method, request, user_data)
    else:
        return await forward_request("user", f"/api/admin/{path}", request.method, request, user_data)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Radon AI API Gateway",
        "version": "2.0.0",
        "status": "running",
        "services": list(SERVICE_URLS.keys())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )
