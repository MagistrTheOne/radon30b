from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
import os
import json
import time
import logging
import torch
import soundfile as sf
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
import asyncio
import base64
import io
from PIL import Image

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

# Qwen3-Omni configuration
QWEN_MODEL_PATH = os.getenv("QWEN_MODEL_PATH", "Qwen/Qwen3-Omni-30B-A3B-Instruct")
RADON_API_URL = os.getenv("RADON_API_URL")

if not RADON_API_URL:
    raise ValueError("RADON_API_URL environment variable is required")
RADON_API_KEY = os.getenv("RADON_API_KEY")

# Initialize Qwen3-Omni model (lazy loading)
model = None
processor = None

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
    video_url: Optional[str] = None

class MultimodalRequest(BaseModel):
    text: Optional[str] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    video_url: Optional[str] = None
    max_new_tokens: int = 2048
    temperature: float = 0.7
    personality: str = "helpful"
    enable_functions: bool = True
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None
    speaker: str = "Ethan"  # For audio output
    use_audio_in_video: bool = True

class QwenConversationRequest(BaseModel):
    messages: List[Dict[str, Any]]
    speaker: str = "Ethan"
    use_audio_in_video: bool = True
    max_new_tokens: int = 2048
    temperature: float = 0.7

# Response models
class InferenceResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None
    function_calls: Optional[Dict[str, Any]] = None
    personality_used: Optional[str] = None
    tokens_used: Optional[int] = None
    processing_time: float
    audio_url: Optional[str] = None  # For audio output

class QwenResponse(BaseModel):
    text: str
    audio_url: Optional[str] = None
    processing_time: float
    tokens_used: Optional[int] = None

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

# Helper functions
async def load_qwen_model():
    """Load Qwen3-Omni model and processor"""
    global model, processor
    
    if model is None or processor is None:
        try:
            from transformers import Qwen3OmniMoeForConditionalGeneration, Qwen3OmniMoeProcessor
            from qwen_omni_utils import process_mm_info
            
            logger.info(f"Loading Qwen3-Omni model: {QWEN_MODEL_PATH}")
            
            model = Qwen3OmniMoeForConditionalGeneration.from_pretrained(
                QWEN_MODEL_PATH,
                dtype="auto",
                device_map="auto",
                attn_implementation="flash_attention_2",
                torch_dtype=torch.bfloat16
            )
            
            processor = Qwen3OmniMoeProcessor.from_pretrained(QWEN_MODEL_PATH)
            
            logger.info("Qwen3-Omni model loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading Qwen3-Omni model: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Model loading failed: {str(e)}")

async def process_multimodal_input(request: MultimodalRequest) -> Dict[str, Any]:
    """Process multimodal input for Qwen3-Omni"""
    try:
        from qwen_omni_utils import process_mm_info
        
        # Build conversation format
        content = []
        
        if request.image_url:
            content.append({"type": "image", "image": request.image_url})
        if request.audio_url:
            content.append({"type": "audio", "audio": request.audio_url})
        if request.video_url:
            content.append({"type": "video", "video": request.video_url})
        if request.text:
            content.append({"type": "text", "text": request.text})
        
        conversation = [{"role": "user", "content": content}]
        
        # Process multimodal info
        text = processor.apply_chat_template(
            conversation, 
            add_generation_prompt=True, 
            tokenize=False
        )
        
        audios, images, videos = process_mm_info(
            conversation, 
            use_audio_in_video=request.use_audio_in_video
        )
        
        inputs = processor(
            text=text,
            audio=audios,
            images=images,
            videos=videos,
            return_tensors="pt",
            padding=True,
            use_audio_in_video=request.use_audio_in_video
        )
        
        inputs = inputs.to(model.device).to(model.dtype)
        
        return {
            "inputs": inputs,
            "conversation": conversation
        }
        
    except Exception as e:
        logger.error(f"Error processing multimodal input: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Input processing failed: {str(e)}")

async def generate_qwen_response(
    inputs: Dict[str, Any], 
    speaker: str = "Ethan",
    max_new_tokens: int = 2048,
    temperature: float = 0.7,
    use_audio_in_video: bool = True
) -> Dict[str, Any]:
    """Generate response using Qwen3-Omni"""
    try:
        # Generate text and audio
        text_ids, audio = model.generate(
            **inputs,
            speaker=speaker,
            thinker_return_dict_in_generate=True,
            use_audio_in_video=use_audio_in_video,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            do_sample=True if temperature > 0 else False
        )
        
        # Decode text
        text = processor.batch_decode(
            text_ids.sequences[:, inputs["input_ids"].shape[1]:],
            skip_special_tokens=True,
            clean_up_tokenization_spaces=False
        )[0]
        
        # Save audio if generated
        audio_url = None
        if audio is not None:
            audio_filename = f"qwen_audio_{int(time.time())}.wav"
            audio_path = f"/tmp/{audio_filename}"
            
            sf.write(
                audio_path,
                audio.reshape(-1).detach().cpu().numpy(),
                samplerate=24000,
            )
            
            # In production, upload to file service
            audio_url = f"/api/files/{audio_filename}"
        
        return {
            "text": text,
            "audio_url": audio_url,
            "tokens_used": text_ids.sequences.shape[1] - inputs["input_ids"].shape[1]
        }
        
    except Exception as e:
        logger.error(f"Error generating Qwen response: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

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
    
    # Check Qwen3-Omni model status
    qwen_loaded = model is not None and processor is not None
    gpu_available = torch.cuda.is_available() if torch.cuda.is_available() else False
    
    # Get GPU memory usage if available
    memory_usage = None
    if torch.cuda.is_available():
        memory_usage = {
            "allocated": torch.cuda.memory_allocated() / 1024**3,  # GB
            "reserved": torch.cuda.memory_reserved() / 1024**3,    # GB
            "max_allocated": torch.cuda.max_memory_allocated() / 1024**3  # GB
        }
    
    overall_status = "healthy" if (radon_healthy or qwen_loaded) else "degraded"
    
    return HealthResponse(
        status=overall_status,
        model_loaded=qwen_loaded,
        gpu_available=gpu_available,
        memory_usage=memory_usage,
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
    """Multimodal AI inference (text, image, audio, video) using Qwen3-Omni"""
    start_time = time.time()
    
    try:
        # Load Qwen3-Omni model if not loaded
        await load_qwen_model()
        
        # Process multimodal input
        processed_input = await process_multimodal_input(request)
        
        # Generate response
        qwen_response = await generate_qwen_response(
            processed_input["inputs"],
            speaker=request.speaker,
            max_new_tokens=request.max_new_tokens,
            temperature=request.temperature,
            use_audio_in_video=request.use_audio_in_video
        )
        
        # Update metrics
        processing_time = time.time() - start_time
        metrics["total_requests"] += 1
        metrics["total_tokens"] += qwen_response.get("tokens_used", 0)
        metrics["average_latency"] = (metrics["average_latency"] + processing_time) / 2
        metrics["last_request"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        
        return InferenceResponse(
            response=qwen_response["text"],
            conversation_id=request.conversation_id,
            function_calls=None,
            personality_used=request.personality,
            tokens_used=qwen_response.get("tokens_used"),
            processing_time=processing_time,
            audio_url=qwen_response.get("audio_url")
        )
        
    except Exception as e:
        metrics["error_count"] += 1
        logger.error(f"Multimodal inference error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/qwen/conversation", response_model=QwenResponse)
async def qwen_conversation(request: QwenConversationRequest):
    """Direct Qwen3-Omni conversation with full control"""
    start_time = time.time()
    
    try:
        # Load Qwen3-Omni model if not loaded
        await load_qwen_model()
        
        # Process conversation
        from qwen_omni_utils import process_mm_info
        
        text = processor.apply_chat_template(
            request.messages,
            add_generation_prompt=True,
            tokenize=False
        )
        
        audios, images, videos = process_mm_info(
            request.messages,
            use_audio_in_video=request.use_audio_in_video
        )
        
        inputs = processor(
            text=text,
            audio=audios,
            images=images,
            videos=videos,
            return_tensors="pt",
            padding=True,
            use_audio_in_video=request.use_audio_in_video
        )
        
        inputs = inputs.to(model.device).to(model.dtype)
        
        # Generate response
        qwen_response = await generate_qwen_response(
            inputs,
            speaker=request.speaker,
            max_new_tokens=request.max_new_tokens,
            temperature=request.temperature,
            use_audio_in_video=request.use_audio_in_video
        )
        
        # Update metrics
        processing_time = time.time() - start_time
        metrics["total_requests"] += 1
        metrics["total_tokens"] += qwen_response.get("tokens_used", 0)
        metrics["average_latency"] = (metrics["average_latency"] + processing_time) / 2
        metrics["last_request"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        
        return QwenResponse(
            text=qwen_response["text"],
            audio_url=qwen_response.get("audio_url"),
            processing_time=processing_time,
            tokens_used=qwen_response.get("tokens_used")
        )
        
    except Exception as e:
        metrics["error_count"] += 1
        logger.error(f"Qwen conversation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/qwen/upload")
async def upload_multimodal_files(
    files: List[UploadFile] = File(...),
    text: Optional[str] = None,
    speaker: str = "Ethan",
    max_new_tokens: int = 2048,
    temperature: float = 0.7
):
    """Upload files and process with Qwen3-Omni"""
    start_time = time.time()
    
    try:
        # Load Qwen3-Omni model if not loaded
        await load_qwen_model()
        
        # Process uploaded files
        content = []
        
        for file in files:
            if file.content_type.startswith("image/"):
                # Save image temporarily
                image_data = await file.read()
                image = Image.open(io.BytesIO(image_data))
                image_path = f"/tmp/{file.filename}"
                image.save(image_path)
                content.append({"type": "image", "image": image_path})
                
            elif file.content_type.startswith("audio/"):
                # Save audio temporarily
                audio_data = await file.read()
                audio_path = f"/tmp/{file.filename}"
                with open(audio_path, "wb") as f:
                    f.write(audio_data)
                content.append({"type": "audio", "audio": audio_path})
                
            elif file.content_type.startswith("video/"):
                # Save video temporarily
                video_data = await file.read()
                video_path = f"/tmp/{file.filename}"
                with open(video_path, "wb") as f:
                    f.write(video_data)
                content.append({"type": "video", "video": video_path})
        
        if text:
            content.append({"type": "text", "text": text})
        
        conversation = [{"role": "user", "content": content}]
        
        # Process with Qwen3-Omni
        from qwen_omni_utils import process_mm_info
        
        text_template = processor.apply_chat_template(
            conversation,
            add_generation_prompt=True,
            tokenize=False
        )
        
        audios, images, videos = process_mm_info(conversation, use_audio_in_video=True)
        
        inputs = processor(
            text=text_template,
            audio=audios,
            images=images,
            videos=videos,
            return_tensors="pt",
            padding=True,
            use_audio_in_video=True
        )
        
        inputs = inputs.to(model.device).to(model.dtype)
        
        # Generate response
        qwen_response = await generate_qwen_response(
            inputs,
            speaker=speaker,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            use_audio_in_video=True
        )
        
        # Update metrics
        processing_time = time.time() - start_time
        metrics["total_requests"] += 1
        metrics["total_tokens"] += qwen_response.get("tokens_used", 0)
        metrics["average_latency"] = (metrics["average_latency"] + processing_time) / 2
        metrics["last_request"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        
        return QwenResponse(
            text=qwen_response["text"],
            audio_url=qwen_response.get("audio_url"),
            processing_time=processing_time,
            tokens_used=qwen_response.get("tokens_used")
        )
        
    except Exception as e:
        metrics["error_count"] += 1
        logger.error(f"File upload processing error: {str(e)}")
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
