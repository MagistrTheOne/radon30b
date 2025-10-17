import asyncio
import httpx
import os
from typing import Optional, AsyncGenerator
from dotenv import load_dotenv

load_dotenv()

class AIService:
    """Service for interacting with Radon AI API"""
    
    def __init__(self):
        self.api_key = os.getenv("RADON_AI_API_KEY")
        self.api_url = os.getenv("RADON_AI_API_URL", "https://api.radonai.com/v1")
        self.timeout = 30.0
    
    async def generate_response(
        self, 
        prompt: str, 
        image_url: Optional[str] = None,
        stream: bool = False
    ) -> str:
        """
        Generate a response from Radon AI
        
        Args:
            prompt: Text prompt for the AI
            image_url: Optional image URL for multimodal processing
            stream: Whether to stream the response
            
        Returns:
            Generated response text
        """
        if not self.api_key:
            # Return mock response for development
            return await self._generate_mock_response(prompt, image_url)
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {
                    "prompt": prompt,
                    "stream": stream,
                    "max_tokens": 2048,
                    "temperature": 0.7
                }
                
                if image_url:
                    payload["image_url"] = image_url
                
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                
                response = await client.post(
                    f"{self.api_url}/chat/completions",
                    json=payload,
                    headers=headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get("choices", [{}])[0].get("message", {}).get("content", "")
                else:
                    raise Exception(f"API request failed: {response.status_code}")
                    
        except Exception as e:
            print(f"Error calling Radon AI API: {e}")
            # Fallback to mock response
            return await self._generate_mock_response(prompt, image_url)
    
    async def generate_stream_response(
        self, 
        prompt: str, 
        image_url: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """
        Generate a streaming response from Radon AI
        
        Args:
            prompt: Text prompt for the AI
            image_url: Optional image URL for multimodal processing
            
        Yields:
            Response chunks as they arrive
        """
        if not self.api_key:
            # Return mock streaming response for development
            async for chunk in self._generate_mock_stream_response(prompt, image_url):
                yield chunk
            return
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {
                    "prompt": prompt,
                    "stream": True,
                    "max_tokens": 2048,
                    "temperature": 0.7
                }
                
                if image_url:
                    payload["image_url"] = image_url
                
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                
                async with client.stream(
                    "POST",
                    f"{self.api_url}/chat/completions",
                    json=payload,
                    headers=headers
                ) as response:
                    if response.status_code == 200:
                        async for line in response.aiter_lines():
                            if line.startswith("data: "):
                                data = line[6:]  # Remove "data: " prefix
                                if data.strip() == "[DONE]":
                                    break
                                try:
                                    import json
                                    chunk_data = json.loads(data)
                                    content = chunk_data.get("choices", [{}])[0].get("delta", {}).get("content", "")
                                    if content:
                                        yield content
                                except json.JSONDecodeError:
                                    continue
                    else:
                        raise Exception(f"Streaming API request failed: {response.status_code}")
                        
        except Exception as e:
            print(f"Error calling Radon AI streaming API: {e}")
            # Fallback to mock streaming response
            async for chunk in self._generate_mock_stream_response(prompt, image_url):
                yield chunk
    
    async def _generate_mock_response(
        self, 
        prompt: str, 
        image_url: Optional[str] = None
    ) -> str:
        """Generate a mock response for development"""
        await asyncio.sleep(1)  # Simulate processing time
        
        if image_url:
            return f"Я проанализировал изображение и вижу следующее: {prompt}. Это демо-ответ от Radon AI 30B. В реальной версии здесь будет детальный анализ изображения с использованием мультимодальных возможностей нейросети."
        else:
            return f"Это демо-ответ от Radon AI 30B параметров. Вы написали: '{prompt}'. В реальной версии здесь будет интеллектуальный ответ, сгенерированный российской мультимодальной нейросетью. Radon AI способен генерировать текст, анализировать изображения и создавать код на высоком уровне."
    
    async def _generate_mock_stream_response(
        self, 
        prompt: str, 
        image_url: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """Generate a mock streaming response for development"""
        mock_response = await self._generate_mock_response(prompt, image_url)
        
        # Split response into chunks and stream them
        words = mock_response.split()
        for i, word in enumerate(words):
            await asyncio.sleep(0.1)  # Simulate streaming delay
            yield word + (" " if i < len(words) - 1 else "")
    
    def check_rate_limit(self, user_subscription: str) -> bool:
        """
        Check if user has exceeded rate limits
        
        Args:
            user_subscription: User's subscription tier
            
        Returns:
            True if request is allowed, False if rate limited
        """
        # TODO: Implement actual rate limiting logic
        # For now, allow all requests
        return True
    
    def get_usage_stats(self, user_id: str) -> dict:
        """
        Get user's usage statistics
        
        Args:
            user_id: User ID
            
        Returns:
            Dictionary with usage statistics
        """
        # TODO: Implement actual usage tracking
        return {
            "requests_today": 0,
            "requests_this_month": 0,
            "subscription_tier": "free",
            "rate_limit_remaining": 10
        }
