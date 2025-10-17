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
  createdAt: Date
}

export interface CreateChatRequest {
  title: string
}

export interface SendMessageRequest {
  content: string
  imageUrl?: string
}

export interface ChatResponse {
  id: string
  title: string
  createdAt: string
  messageCount: number
}

export interface MessageResponse {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  createdAt: string
}
