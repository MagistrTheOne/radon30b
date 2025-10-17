export interface User {
  id: string
  clerkId: string
  email: string
  subscriptionTier: 'free' | 'pro' | 'enterprise'
  createdAt: Date
}

export interface Chat {
  id: string
  userId: string
  title: string
  createdAt: Date
  messages: Message[]
}

export interface Message {
  id: string
  chatId: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  audioUrl?: string
  audioTranscription?: string
  audioDuration?: number
  // New fields for API v2.0.0
  functionCalls?: Array<{
    name: string
    arguments: Record<string, unknown>
    result?: unknown
    status?: 'pending' | 'success' | 'error'
    execution_time?: number
  }>
  personalityUsed?: string
  conversationId?: string
  createdAt: Date
  editedAt?: Date
  isEdited?: boolean
}

export interface MessageEdit {
  id: string
  messageId: string
  previousContent: string
  editedAt: Date
}

export interface CreateChatRequest {
  title: string
}

export interface SendMessageRequest {
  content: string
  imageUrl?: string
  audioFile?: File
}

export interface ChatResponse {
  id: string
  title: string
  createdAt: string
  messageCount: number
  messages?: MessageResponse[]
}

export interface MessageResponse {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  audioUrl?: string
  audioTranscription?: string
  audioDuration?: number
  // New fields for API v2.0.0
  functionCalls?: Array<{
    name: string
    arguments: Record<string, unknown>
    result?: unknown
    status?: 'pending' | 'success' | 'error'
    execution_time?: number
  }>
  personalityUsed?: string
  conversationId?: string
  createdAt: string
  editedAt?: string
  isEdited?: boolean
}
