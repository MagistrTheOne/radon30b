from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
import os
import json
import time
import logging
from typing import Optional, Dict, Any
from pydantic import BaseModel
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Radon AI Service",
    description="AI Service для Radon AI 30B с поддержкой мультимодальности",
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

# Radon AI API configuration
RADON_API_URL = os.getenv("RADON_API_URL", "http://213.219.215.235:8000")
RADON_API_KEY = os.getenv("RADON_API_KEY")

# Request models
class InferenceRequest(BaseModel):
    prompt: str
    max_new_tokens: int = 2048
    temperature: float = 0.7
    personality: str = "helpful"
    enable_functions: bool = True
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None

class MultimodalRequest(BaseModel):
    text: Optional[str] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    max_new_tokens: int = 2048
    temperature: float = 0.7
    personality: str = "helpful"
    enable_functions: bool = True
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None

# Response models
class InferenceResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None
    function_calls: Optional[Dict[str, Any]] = None
    personality_used: Optional[str] = None
    tokens_used: Optional[int] = None
    processing_time: float

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    gpu_available: bool
    memory_usage: Optional[Dict[str, Any]] = None
    timestamp: str

# Metrics storage
metrics = {
    "total_requests": 0,
    "total_tokens": 0,
    "average_latency": 0.0,
    "error_count": 0,
    "last_request": None
}

async def call_radon_api(request_data: Dict[str, Any], stream: bool = False) -> Dict[str, Any]:
    """Call Radon AI API with retry logic"""
    max_retries = 3
    retry_delay = 1.0
    
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                headers = {
                    "Content-Type": "application/json",
                    "User-Agent": "Radon-AI-Service/2.0.0"
                }
                
                if RADON_API_KEY:
                    headers["Authorization"] = f"Bearer {RADON_API_KEY}"
                
                if stream:
                    # For streaming, we'll handle it differently
                    response = await client.post(
                        f"{RADON_API_URL}/chat/stream",
                        json=request_data,
                        headers=headers
                    )
                else:
                    response = await client.post(
                        f"{RADON_API_URL}/chat",
                        json=request_data,
                        headers=headers
                    )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"Radon API error: {response.status_code} - {response.text}")
                    if attempt < max_retries - 1:
                        await asyncio.sleep(retry_delay * (2 ** attempt))
                        continue
                    else:
                        raise HTTPException(status_code=response.status_code, detail="Radon API error")
                        
        except httpx.TimeoutException:
            logger.error(f"Timeout calling Radon API (attempt {attempt + 1})")
            if attempt < max_retries - 1:
                await asyncio.sleep(retry_delay * (2 ** attempt))
                continue
            else:
                raise HTTPException(status_code=504, detail="Radon API timeout")
                
        except Exception as e:
            logger.error(f"Error calling Radon API: {str(e)}")
            if attempt < max_retries - 1:
                await asyncio.sleep(retry_delay * (2 ** attempt))
                continue
            else:
                raise HTTPException(status_code=500, detail="Internal server error")

async def stream_radon_response(request_data: Dict[str, Any]):
    """Stream response from Radon AI API"""
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            headers = {
                "Content-Type": "application/json",
                "User-Agent": "Radon-AI-Service/2.0.0"
            }
            
            if RADON_API_KEY:
                headers["Authorization"] = f"Bearer {RADON_API_KEY}"
            
            async with client.stream(
                "POST",
                f"{RADON_API_URL}/chat/stream",
                json=request_data,
                headers=headers
            ) as response:
                if response.status_code != 200:
                    yield f"data: {json.dumps({'error': 'Radon API error'})}\n\n"
                    return
                
                async for chunk in response.aiter_lines():
                    if chunk:
                        yield f"data: {chunk}\n\n"
                        
    except Exception as e:
        logger.error(f"Error streaming from Radon API: {str(e)}")
        yield f"data: {json.dumps({'error': 'Streaming error'})}\n\n"

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        # Check if Radon API is accessible
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{RADON_API_URL}/health")
            radon_healthy = response.status_code == 200
    except:
        radon_healthy = False
    
    return HealthResponse(
        status="healthy" if radon_healthy else "degraded",
        model_loaded=radon_healthy,
        gpu_available=radon_healthy,  # In production, check actual GPU status
        memory_usage=None,  # In production, get actual memory usage
        timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    )

@app.get("/metrics")
async def get_metrics():
    """Get service metrics"""
    return {
        "service": "ai-service",
        "metrics": metrics,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

@app.post("/inference", response_model=InferenceResponse)
async def inference(request: InferenceRequest):
    """Generate AI response"""
    start_time = time.time()
    
    try:
        # Prepare request data
        request_data = {
            "prompt": request.prompt,
            "max_new_tokens": request.max_new_tokens,
            "temperature": request.temperature,
            "personality": request.personality,
            "enable_functions": request.enable_functions,
            "conversation_id": request.conversation_id,
            "user_id": request.user_id
        }
        
        # Add image/audio if provided
        if request.image_url:
            request_data["image_url"] = request.image_url
        if request.audio_url:
            request_data["audio_url"] = request.audio_url
        
        # Call Radon API
        response = await call_radon_api(request_data)
        
        # Update metrics
        processing_time = time.time() - start_time
        metrics["total_requests"] += 1
        metrics["total_tokens"] += response.get("tokens_used", 0)
        metrics["average_latency"] = (metrics["average_latency"] + processing_time) / 2
        metrics["last_request"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        
        return InferenceResponse(
            response=response.get("response", ""),
            conversation_id=response.get("conversation_id"),
            function_calls=response.get("function_calls"),
            personality_used=response.get("personality_used"),
            tokens_used=response.get("tokens_used"),
            processing_time=processing_time
        )
        
    except Exception as e:
        metrics["error_count"] += 1
        logger.error(f"Inference error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/inference/stream")
async def inference_stream(request: InferenceRequest):
    """Stream AI response"""
    try:
        # Prepare request data
        request_data = {
            "prompt": request.prompt,
            "max_new_tokens": request.max_new_tokens,
            "temperature": request.temperature,
            "personality": request.personality,
            "enable_functions": request.enable_functions,
            "conversation_id": request.conversation_id,
            "user_id": request.user_id
        }
        
        # Add image/audio if provided
        if request.image_url:
            request_data["image_url"] = request.image_url
        if request.audio_url:
            request_data["audio_url"] = request.audio_url
        
        # Update metrics
        metrics["total_requests"] += 1
        metrics["last_request"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        
        return StreamingResponse(
            stream_radon_response(request_data),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )
        
    except Exception as e:
        metrics["error_count"] += 1
        logger.error(f"Streaming inference error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/multimodal", response_model=InferenceResponse)
async def multimodal_inference(request: MultimodalRequest):
    """Multimodal AI inference (text, image, audio)"""
    start_time = time.time()
    
    try:
        # Prepare request data
        request_data = {
            "max_new_tokens": request.max_new_tokens,
            "temperature": request.temperature,
            "personality": request.personality,
            "enable_functions": request.enable_functions,
            "conversation_id": request.conversation_id,
            "user_id": request.user_id
        }
        
        # Add content based on what's provided
        if request.text:
            request_data["prompt"] = request.text
        if request.image_url:
            request_data["image_url"] = request.image_url
        if request.audio_url:
            request_data["audio_url"] = request.audio_url
        
        # Call Radon API
        response = await call_radon_api(request_data)
        
        # Update metrics
        processing_time = time.time() - start_time
        metrics["total_requests"] += 1
        metrics["total_tokens"] += response.get("tokens_used", 0)
        metrics["average_latency"] = (metrics["average_latency"] + processing_time) / 2
        metrics["last_request"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        
        return InferenceResponse(
            response=response.get("response", ""),
            conversation_id=response.get("conversation_id"),
            function_calls=response.get("function_calls"),
            personality_used=response.get("personality_used"),
            tokens_used=response.get("tokens_used"),
            processing_time=processing_time
        )
        
    except Exception as e:
        metrics["error_count"] += 1
        logger.error(f"Multimodal inference error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {
        "message": "Radon AI Service",
        "version": "2.0.0",
        "status": "running",
        "endpoints": [
            "/inference",
            "/inference/stream",
            "/multimodal",
            "/health",
            "/metrics"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )
