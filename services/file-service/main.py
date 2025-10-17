from fastapi import FastAPI, HTTPException, Depends, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import json
import time
import logging
import uuid
import mimetypes
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime
import aiofiles
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Radon AI File Service",
    description="File Service для управления файлами и загрузками",
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

# Configuration
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/app/uploads")
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", "50 * 1024 * 1024"))  # 50MB
ALLOWED_EXTENSIONS = {
    "image": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    "audio": [".mp3", ".wav", ".ogg", ".m4a", ".aac"],
    "video": [".mp4", ".avi", ".mov", ".wmv"],
    "document": [".pdf", ".doc", ".docx", ".txt", ".md"]
}

# Create upload directories
os.makedirs(f"{UPLOAD_DIR}/images", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/audio", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/videos", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/documents", exist_ok=True)

# Request models
class FileMetadata(BaseModel):
    filename: str
    content_type: str
    size: int
    file_type: str
    duration: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None

# Response models
class FileUploadResponse(BaseModel):
    file_id: str
    filename: str
    url: str
    content_type: str
    size: int
    file_type: str
    metadata: Optional[Dict[str, Any]] = None

class FileListResponse(BaseModel):
    files: List[Dict[str, Any]]
    total: int

# In-memory storage (in production, use PostgreSQL)
files_db = {}

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

def get_file_type(content_type: str) -> str:
    """Determine file type from content type"""
    if content_type.startswith("image/"):
        return "image"
    elif content_type.startswith("audio/"):
        return "audio"
    elif content_type.startswith("video/"):
        return "video"
    elif content_type.startswith("application/pdf") or content_type.startswith("text/"):
        return "document"
    else:
        return "other"

def is_allowed_file(filename: str, content_type: str) -> bool:
    """Check if file type is allowed"""
    file_type = get_file_type(content_type)
    if file_type not in ALLOWED_EXTENSIONS:
        return False
    
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS[file_type]

async def extract_metadata(file_path: str, content_type: str) -> Dict[str, Any]:
    """Extract metadata from file"""
    metadata = {}
    
    try:
        if content_type.startswith("image/"):
            # In production, use PIL or similar to get image dimensions
            metadata["width"] = 1920  # Placeholder
            metadata["height"] = 1080  # Placeholder
        
        elif content_type.startswith("audio/"):
            # In production, use librosa or similar to get audio duration
            metadata["duration"] = 120  # Placeholder in seconds
        
        elif content_type.startswith("video/"):
            # In production, use ffmpeg or similar to get video metadata
            metadata["duration"] = 300  # Placeholder in seconds
            metadata["width"] = 1920  # Placeholder
            metadata["height"] = 1080  # Placeholder
        
    except Exception as e:
        logger.error(f"Error extracting metadata: {str(e)}")
    
    return metadata

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "file-service",
        "timestamp": datetime.utcnow().isoformat(),
        "upload_dir": UPLOAD_DIR
    }

# File upload endpoints
@app.post("/api/upload", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    request: Request = None
):
    """Upload file"""
    user_id = get_user_id(request)
    
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not is_allowed_file(file.filename, file.content_type):
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    # Check file size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large")
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    file_type = get_file_type(file.content_type)
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{file_id}{file_extension}"
    
    # Save file
    file_path = f"{UPLOAD_DIR}/{file_type}s/{filename}"
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)
    
    # Extract metadata
    metadata = await extract_metadata(file_path, file.content_type)
    
    # Calculate file hash
    file_hash = hashlib.md5(content).hexdigest()
    
    # Store file info
    file_info = {
        "file_id": file_id,
        "filename": file.filename,
        "stored_filename": filename,
        "content_type": file.content_type,
        "size": len(content),
        "file_type": file_type,
        "file_path": file_path,
        "url": f"/api/files/{file_id}",
        "user_id": user_id,
        "hash": file_hash,
        "metadata": metadata,
        "created_at": datetime.utcnow().isoformat()
    }
    
    files_db[file_id] = file_info
    
    # Publish event
    await publish_event("file.uploaded", {
        "file_id": file_id,
        "user_id": user_id,
        "filename": file.filename,
        "file_type": file_type,
        "size": len(content)
    })
    
    return FileUploadResponse(
        file_id=file_id,
        filename=file.filename,
        url=file_info["url"],
        content_type=file.content_type,
        size=len(content),
        file_type=file_type,
        metadata=metadata
    )

@app.get("/api/files/{file_id}")
async def get_file(file_id: str, request: Request):
    """Get file by ID"""
    user_id = get_user_id(request)
    
    if file_id not in files_db:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_info = files_db[file_id]
    
    # Check if user has access to file
    if file_info["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Return file
    return FileResponse(
        path=file_info["file_path"],
        filename=file_info["filename"],
        media_type=file_info["content_type"]
    )

@app.get("/api/files", response_model=FileListResponse)
async def list_files(request: Request, file_type: Optional[str] = None):
    """List user files"""
    user_id = get_user_id(request)
    
    user_files = []
    for file_id, file_info in files_db.items():
        if file_info["user_id"] == user_id:
            if file_type is None or file_info["file_type"] == file_type:
                user_files.append({
                    "file_id": file_id,
                    "filename": file_info["filename"],
                    "content_type": file_info["content_type"],
                    "size": file_info["size"],
                    "file_type": file_info["file_type"],
                    "url": file_info["url"],
                    "created_at": file_info["created_at"],
                    "metadata": file_info.get("metadata", {})
                })
    
    # Sort by creation date (newest first)
    user_files.sort(key=lambda x: x["created_at"], reverse=True)
    
    return FileListResponse(
        files=user_files,
        total=len(user_files)
    )

@app.delete("/api/files/{file_id}")
async def delete_file(file_id: str, request: Request):
    """Delete file"""
    user_id = get_user_id(request)
    
    if file_id not in files_db:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_info = files_db[file_id]
    
    # Check if user has access to file
    if file_info["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Delete physical file
    try:
        if os.path.exists(file_info["file_path"]):
            os.remove(file_info["file_path"])
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
    
    # Remove from database
    del files_db[file_id]
    
    # Publish event
    await publish_event("file.deleted", {
        "file_id": file_id,
        "user_id": user_id,
        "filename": file_info["filename"]
    })
    
    return {"message": "File deleted successfully"}

@app.get("/api/files/{file_id}/metadata")
async def get_file_metadata(file_id: str, request: Request):
    """Get file metadata"""
    user_id = get_user_id(request)
    
    if file_id not in files_db:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_info = files_db[file_id]
    
    # Check if user has access to file
    if file_info["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "file_id": file_id,
        "filename": file_info["filename"],
        "content_type": file_info["content_type"],
        "size": file_info["size"],
        "file_type": file_info["file_type"],
        "hash": file_info["hash"],
        "metadata": file_info.get("metadata", {}),
        "created_at": file_info["created_at"]
    }

# Admin endpoints
@app.get("/api/admin/files")
async def get_all_files(request: Request):
    """Get all files (admin only)"""
    user_id = get_user_id(request)
    
    # In production, check if user is admin
    # For now, return all files
    
    all_files = []
    for file_id, file_info in files_db.items():
        all_files.append({
            "file_id": file_id,
            "filename": file_info["filename"],
            "content_type": file_info["content_type"],
            "size": file_info["size"],
            "file_type": file_info["file_type"],
            "user_id": file_info["user_id"],
            "created_at": file_info["created_at"]
        })
    
    return {
        "files": all_files,
        "total": len(all_files)
    }

@app.get("/api/admin/stats")
async def get_file_stats(request: Request):
    """Get file service statistics"""
    user_id = get_user_id(request)
    
    # In production, check if user is admin
    # For now, return stats
    
    total_files = len(files_db)
    total_size = sum(file_info["size"] for file_info in files_db.values())
    
    # File type breakdown
    type_breakdown = {}
    for file_info in files_db.values():
        file_type = file_info["file_type"]
        type_breakdown[file_type] = type_breakdown.get(file_type, 0) + 1
    
    return {
        "total_files": total_files,
        "total_size": total_size,
        "type_breakdown": type_breakdown,
        "storage_used_mb": round(total_size / (1024 * 1024), 2)
    }

@app.get("/")
async def root():
    return {
        "message": "Radon AI File Service",
        "version": "2.0.0",
        "status": "running",
        "max_file_size_mb": MAX_FILE_SIZE // (1024 * 1024),
        "allowed_types": list(ALLOWED_EXTENSIONS.keys())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8005,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )
