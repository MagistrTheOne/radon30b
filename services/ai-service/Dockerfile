# Base image with CUDA support for VK Cloud H200
FROM nvidia/cuda:12.1-devel-ubuntu22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3.11-pip \
    python3.11-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create symbolic link for python
RUN ln -s /usr/bin/python3.11 /usr/bin/python

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
