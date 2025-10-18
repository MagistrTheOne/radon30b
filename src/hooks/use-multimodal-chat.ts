'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface MultimodalMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  audioUrl?: string
  videoUrl?: string
  personality?: string
  timestamp: string
}

interface UseMultimodalChatOptions {
  conversationId?: string
  onError?: (error: string) => void
}

export function useMultimodalChat({ conversationId, onError }: UseMultimodalChatOptions = {}) {
  const [messages, setMessages] = useState<MultimodalMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (data: {
    text?: string
    image?: File
    audio?: File
    video?: File
    personality?: string
    responseFormat?: 'text' | 'speech' | 'both'
  }) => {
    setIsLoading(true)

    try {
      // Создаем пользовательское сообщение
      const userMessage: MultimodalMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: data.text || '',
        imageUrl: data.image ? URL.createObjectURL(data.image) : undefined,
        audioUrl: data.audio ? URL.createObjectURL(data.audio) : undefined,
        videoUrl: data.video ? URL.createObjectURL(data.video) : undefined,
        personality: data.personality,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, userMessage])

      // Подготавливаем FormData для отправки
      const formData = new FormData()
      
      if (data.text) formData.append('text', data.text)
      if (data.image) formData.append('image', data.image)
      if (data.audio) formData.append('audio', data.audio)
      if (data.video) formData.append('video', data.video)
      if (data.personality) formData.append('personality', data.personality)
      if (data.responseFormat) formData.append('response_format', data.responseFormat)
      if (conversationId) formData.append('conversation_id', conversationId)
      formData.append('enable_functions', 'true')

      // Отправляем запрос к API
      const response = await fetch('/api/radon/multimodal', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      // Обрабатываем ответ
      const contentType = response.headers.get('content-type')
      let assistantMessage: MultimodalMessage

      if (contentType?.includes('application/json')) {
        const data = await response.json()
        assistantMessage = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: data.response || data.content || '',
          imageUrl: data.imageUrl,
          audioUrl: data.audioUrl,
          videoUrl: data.videoUrl,
          personality: data.personality,
          timestamp: new Date().toISOString()
        }
      } else if (contentType?.includes('audio/')) {
        // Аудио ответ
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        assistantMessage = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: '🎤 Голосовой ответ',
          audioUrl,
          personality: data.personality,
          timestamp: new Date().toISOString()
        }
      } else {
        // Текстовый ответ
        const text = await response.text()
        assistantMessage = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: text,
          personality: data.personality,
          timestamp: new Date().toISOString()
        }
      }

      setMessages(prev => [...prev, assistantMessage])
      toast.success('Сообщение отправлено')

    } catch (error) {
      console.error('Error sending multimodal message:', error)
      const errorMessage = error instanceof Error ? error.message : 'Ошибка отправки сообщения'
      
      if (onError) {
        onError(errorMessage)
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }, [conversationId, onError])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const deleteMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    deleteMessage
  }
}
