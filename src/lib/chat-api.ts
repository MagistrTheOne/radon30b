import { ChatResponse, MessageResponse } from '@/types/chat'

// CRUD для чатов через Next.js API routes
export const chatApi = {
  // Create
  createChat: async (title: string): Promise<{ data: ChatResponse }> => {
    const response = await fetch('/api/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title })
    })

    if (!response.ok) {
      const error = await response.json()
      const errorMessage = error.details
        ? `${error.error}: ${error.details}`
        : error.error || 'Failed to create chat'
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return { data }
  },

  // Read
  getChats: async (): Promise<{ data: ChatResponse[] }> => {
    const response = await fetch('/api/chats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch chats')
    }

    const data = await response.json()
    return { data }
  },
  
  getChat: async (chatId: string): Promise<{ data: ChatResponse }> => {
    const response = await fetch(`/api/chats/${chatId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch chat')
    }

    const data = await response.json()
    return { data }
  },

  // Update
  updateChat: async (chatId: string, data: { title?: string }): Promise<{ data: ChatResponse }> => {
    const response = await fetch(`/api/chats/${chatId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update chat')
    }

    const responseData = await response.json()
    return { data: responseData }
  },

  // Delete
  deleteChat: async (chatId: string): Promise<void> => {
    const response = await fetch(`/api/chats/${chatId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete chat')
    }
  },

  // Сообщения
  sendMessage: async (chatId: string, content: string, imageUrl?: string, audioFile?: File): Promise<{ data: MessageResponse }> => {
    // Если есть аудио файл, используем FormData
    if (audioFile) {
      const formData = new FormData()
      formData.append('content', content)
      if (imageUrl) {
        formData.append('imageUrl', imageUrl)
      }
      formData.append('audio', audioFile)

      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send message')
      }

      const data = await response.json()
      return { data }
    } else {
      // Обычный JSON запрос
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, imageUrl })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send message')
      }

      const data = await response.json()
      return { data }
    }
  },

  editMessage: async (chatId: string, messageId: string, content: string): Promise<{ data: MessageResponse }> => {
    const response = await fetch(`/api/chats/${chatId}/messages/${messageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to edit message')
    }

    const data = await response.json()
    return { data }
  },
    
  deleteMessage: async (chatId: string, messageId: string): Promise<void> => {
    const response = await fetch(`/api/chats/${chatId}/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete message')
    }
  },

  // Streaming
  streamMessage: async (chatId: string, content: string, imageUrl?: string): Promise<EventSource> => {
    // Создаем EventSource для SSE streaming
    const eventSource = new EventSource(`/api/chats/${chatId}/stream`, {
      // Отправляем POST данные через URL параметры (не идеально, но работает)
      // В реальном приложении лучше использовать WebSocket или другой подход
    })

    // Отправляем данные через отдельный POST запрос
    await fetch(`/api/chats/${chatId}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, imageUrl })
    })

    return eventSource
  }
}

export default chatApi
