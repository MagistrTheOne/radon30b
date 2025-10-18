import axios, { AxiosResponse } from 'axios'

// Qwen3-Omni API client - используем API Gateway
const qwenApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000',
  timeout: 300000, // 5 minutes for AI processing
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types for Qwen3-Omni
export interface QwenMultimodalRequest {
  text?: string
  image_url?: string
  audio_url?: string
  video_url?: string
  max_new_tokens?: number
  temperature?: number
  personality?: string
  enable_functions?: boolean
  conversation_id?: string
  user_id?: string
  speaker?: string
  use_audio_in_video?: boolean
}

export interface QwenConversationRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: Array<{
      type: 'text' | 'image' | 'audio' | 'video'
      text?: string
      image?: string
      audio?: string
      video?: string
    }>
  }>
  speaker?: string
  use_audio_in_video?: boolean
  max_new_tokens?: number
  temperature?: number
}

export interface QwenResponse {
  text: string
  audio_url?: string
  processing_time: number
  tokens_used?: number
}

export interface QwenInferenceResponse {
  response: string
  conversation_id?: string
  function_calls?: unknown
  personality_used?: string
  tokens_used?: number
  processing_time: number
  audio_url?: string
}

// Qwen3-Omni API functions
export const qwenApiClient = {
  // Multimodal inference with Qwen3-Omni
  async multimodalInference(request: QwenMultimodalRequest): Promise<QwenInferenceResponse> {
    try {
      const response: AxiosResponse<QwenInferenceResponse> = await qwenApi.post('/api/ai/multimodal', request)
      return response.data
    } catch (error) {
      console.error('Qwen multimodal inference error:', error)
      throw new Error(`Qwen multimodal inference failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  // Direct conversation with Qwen3-Omni
  async conversation(request: QwenConversationRequest): Promise<QwenResponse> {
    try {
      const response: AxiosResponse<QwenResponse> = await qwenApi.post('/api/ai/qwen/conversation', request)
      return response.data
    } catch (error) {
      console.error('Qwen conversation error:', error)
      throw new Error(`Qwen conversation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  // Upload files and process with Qwen3-Omni
  async uploadAndProcess(
    files: File[],
    text?: string,
    speaker: string = 'Ethan',
    max_new_tokens: number = 2048,
    temperature: number = 0.7
  ): Promise<QwenResponse> {
    try {
      const formData = new FormData()
      
      // Add files
      files.forEach(file => {
        formData.append('files', file)
      })
      
      // Add text if provided
      if (text) {
        formData.append('text', text)
      }
      
      // Add parameters
      formData.append('speaker', speaker)
      formData.append('max_new_tokens', max_new_tokens.toString())
      formData.append('temperature', temperature.toString())

      const response: AxiosResponse<QwenResponse> = await qwenApi.post('/api/ai/qwen/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes for file processing
      })
      
      return response.data
    } catch (error) {
      console.error('Qwen upload and process error:', error)
      throw new Error(`Qwen upload and process failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  // Health check
  async healthCheck(): Promise<{
    status: string
    model_loaded: boolean
    gpu_available: boolean
    memory_usage?: {
      allocated: number
      reserved: number
      max_allocated: number
    }
    timestamp: string
  }> {
    try {
      const response = await qwenApi.get('/health')
      return response.data
    } catch (error) {
      console.error('Qwen health check error:', error)
      throw new Error(`Qwen health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  // Get metrics
  async getMetrics(): Promise<{
    service: string
    metrics: {
      total_requests: number
      total_tokens: number
      average_latency: number
      error_count: number
      last_request: string | null
    }
    timestamp: string
  }> {
    try {
      const response = await qwenApi.get('/metrics')
      return response.data
    } catch (error) {
      console.error('Qwen metrics error:', error)
      throw new Error(`Qwen metrics failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Helper functions for building Qwen3-Omni conversations
export const qwenHelpers = {
  // Build conversation from chat messages
  buildConversationFromMessages(messages: Array<{
    role: 'user' | 'assistant'
    content: string
    imageUrl?: string
    audioUrl?: string
    videoUrl?: string
  }>): QwenConversationRequest['messages'] {
    return messages.map(msg => {
      const content: Array<{
        type: 'text' | 'image' | 'audio' | 'video'
        text?: string
        image?: string
        audio?: string
        video?: string
      }> = []

      // Add text content
      if (msg.content) {
        content.push({
          type: 'text',
          text: msg.content
        })
      }

      // Add image if present
      if (msg.imageUrl) {
        content.push({
          type: 'image',
          image: msg.imageUrl
        })
      }

      // Add audio if present
      if (msg.audioUrl) {
        content.push({
          type: 'audio',
          audio: msg.audioUrl
        })
      }

      // Add video if present
      if (msg.videoUrl) {
        content.push({
          type: 'video',
          video: msg.videoUrl
        })
      }

      return {
        role: msg.role,
        content
      }
    })
  },

  // Create system prompt for Qwen3-Omni
  createSystemPrompt(personality: string = 'helpful'): QwenConversationRequest['messages'][0] {
    const systemPrompts = {
      helpful: "You are Qwen-Omni, a smart voice assistant created by Alibaba Qwen. You are a virtual voice assistant with no gender or age. You are communicating with the user. In user messages, \"I/me/my/we/our\" refer to the user and \"you/your\" refer to the assistant. In your replies, address the user as \"you/your\" and yourself as \"I/me/my\"; never mirror the user's pronouns—always shift perspective. Keep original pronouns only in direct quotes; if a reference is unclear, ask a brief clarifying question. Interact with users using short(no more than 50 words), brief, straightforward language, maintaining a natural tone. Never use formal phrasing, mechanical expressions, bullet points, overly structured language. Your output must consist only of the spoken content you want the user to hear. Do not include any descriptions of actions, emotions, sounds, or voice changes. Do not use asterisks, brackets, parentheses, or any other symbols to indicate tone or actions. You must answer users' audio or text questions, do not directly describe the video content. You should communicate in the same language strictly as the user unless they request otherwise. When you are uncertain (e.g., you can't see/hear clearly, don't understand, or the user makes a comment rather than asking a question), use appropriate questions to guide the user to continue the conversation. Keep replies concise and conversational, as if talking face-to-face.",
      
      creative: "You are Qwen-Omni, a creative AI assistant with a vibrant personality. You love to explore ideas, create stories, and help users think outside the box. You communicate in a friendly, enthusiastic manner and often use metaphors and creative language. Keep your responses engaging and imaginative while being helpful.",
      
      technical: "You are Qwen-Omni, a technical AI assistant specializing in detailed explanations and problem-solving. You provide precise, accurate information and break down complex topics into understandable parts. You communicate clearly and professionally, focusing on facts and practical solutions."
    }

    return {
      role: 'system',
      content: [{
        type: 'text',
        text: systemPrompts[personality as keyof typeof systemPrompts] || systemPrompts.helpful
      }]
    }
  },

  // Validate file types for Qwen3-Omni
  validateFileType(file: File): boolean {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv'
    ]
    
    return allowedTypes.includes(file.type)
  },

  // Get file type category
  getFileCategory(file: File): 'image' | 'audio' | 'video' | 'unknown' {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('audio/')) return 'audio'
    if (file.type.startsWith('video/')) return 'video'
    return 'unknown'
  }
}

export default qwenApiClient
