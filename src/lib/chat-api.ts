import { apiClient } from './api-client'
import { ChatResponse, MessageResponse, CreateChatRequest, SendMessageRequest } from '@/types/chat'

// CRUD для чатов
export const chatApi = {
  // Create
  createChat: (title: string) => 
    apiClient.post<ChatResponse>('/api/chats/new', { title }),

  // Read
  getChats: () => 
    apiClient.get<ChatResponse[]>('/api/chats'),
  
  getChat: (chatId: string) => 
    apiClient.get<ChatResponse>(`/api/chats/${chatId}`),

  // Update
  updateChat: (chatId: string, data: { title?: string }) => 
    apiClient.put<ChatResponse>(`/api/chats/${chatId}`, data),

  // Delete
  deleteChat: (chatId: string) => 
    apiClient.delete(`/api/chats/${chatId}`),

  // Сообщения
  sendMessage: (chatId: string, content: string, imageUrl?: string) =>
    apiClient.post<MessageResponse>(`/api/chats/${chatId}/messages`, { content, imageUrl }),

  editMessage: (chatId: string, messageId: string, content: string) =>
    apiClient.put<MessageResponse>(`/api/chats/${chatId}/messages/${messageId}`, { content }),
    
  deleteMessage: (chatId: string, messageId: string) =>
    apiClient.delete(`/api/chats/${chatId}/messages/${messageId}`),

  // Streaming
  streamMessage: (chatId: string, content: string, imageUrl?: string) =>
    apiClient.post(`/api/chats/${chatId}/stream`, { content, imageUrl }, {
      responseType: 'stream'
    })
}

export default chatApi
