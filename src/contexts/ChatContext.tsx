"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { chatApi } from '@/lib/chat-api'
import { ChatResponse, MessageResponse } from '@/types/chat'
import { toast } from 'sonner'

interface ChatContextType {
  chats: ChatResponse[]
  currentChat: ChatResponse | null
  messages: MessageResponse[]
  loading: boolean
  error: string | null
  
  // CRUD операции
  createChat: (title: string) => Promise<void>
  updateChat: (chatId: string, title: string) => Promise<void>
  deleteChat: (chatId: string) => Promise<void>
  selectChat: (chatId: string) => Promise<void>
  
  // Сообщения
  sendMessage: (content: string, imageUrl?: string) => Promise<void>
  editMessage: (messageId: string, content: string) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
  
  // Состояние
  setCurrentChat: (chat: ChatResponse | null) => void
  setMessages: (messages: MessageResponse[]) => void
  clearError: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const router = useRouter()
  
  const [chats, setChats] = useState<ChatResponse[]>([])
  const [currentChat, setCurrentChat] = useState<ChatResponse | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загрузка чатов при инициализации
  useEffect(() => {
    if (user) {
      loadChats()
    }
  }, [user])

  const loadChats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await chatApi.getChats()
      setChats(response.data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки чатов'
      setError(errorMessage)
      console.error('Error loading chats:', error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const createChat = async (title: string) => {
    const tempId = `temp-${Date.now()}`
    
    // Оптимистичное обновление
    const tempChat: ChatResponse = {
      id: tempId,
      title,
      createdAt: new Date().toISOString(),
      messageCount: 0
    }
    
    setChats(prev => [tempChat, ...prev])
    setCurrentChat(tempChat)
    setMessages([])
    
    try {
      const response = await chatApi.createChat(title)
      const newChat = response.data
      
      // Заменить временный ID на реальный
      setChats(prev => prev.map(chat => 
        chat.id === tempId ? newChat : chat
      ))
      setCurrentChat(newChat)
      
      // Перейти к новому чату
      router.push(`/chat/${newChat.id}`)
      toast.success('Чат создан')
    } catch (error) {
      // Откатить изменения
      setChats(prev => prev.filter(chat => chat.id !== tempId))
      setCurrentChat(null)
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания чата'
      setError(errorMessage)
      console.error('Error creating chat:', error)
      toast.error(errorMessage)
    }
  }

  const updateChat = async (chatId: string, title: string) => {
    // Оптимистичное обновление
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title } : chat
    ))
    
    if (currentChat?.id === chatId) {
      setCurrentChat(prev => prev ? { ...prev, title } : null)
    }
    
    try {
      const response = await chatApi.updateChat(chatId, { title })
      const updatedChat = response.data
      
      // Обновить с серверными данными
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? updatedChat : chat
      ))
      
      if (currentChat?.id === chatId) {
        setCurrentChat(updatedChat)
      }
      
      toast.success('Чат переименован')
    } catch (error) {
      // Откатить изменения
      loadChats() // Перезагрузить чаты
      const errorMessage = error instanceof Error ? error.message : 'Ошибка переименования чата'
      setError(errorMessage)
      console.error('Error updating chat:', error)
      toast.error(errorMessage)
    }
  }

  const deleteChat = async (chatId: string) => {
    // Оптимистичное обновление
    const deletedChat = chats.find(chat => chat.id === chatId)
    setChats(prev => prev.filter(chat => chat.id !== chatId))
    
    if (currentChat?.id === chatId) {
      setCurrentChat(null)
      setMessages([])
      router.push('/chat')
    }
    
    try {
      await chatApi.deleteChat(chatId)
      toast.success('Чат удален')
    } catch (error) {
      // Откатить изменения
      if (deletedChat) {
        setChats(prev => [deletedChat, ...prev])
      }
      const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления чата'
      setError(errorMessage)
      console.error('Error deleting chat:', error)
      toast.error(errorMessage)
    }
  }

  const selectChat = async (chatId: string) => {
    try {
      setLoading(true)
      const response = await chatApi.getChat(chatId)
      const chat = response.data
      
      setCurrentChat(chat)
      setMessages(chat.messages || [])
      
      router.push(`/chat/${chatId}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки чата'
      setError(errorMessage)
      console.error('Error loading chat:', error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (content: string, imageUrl?: string) => {
    if (!currentChat) {
      toast.error('Выберите чат')
      return
    }

    const tempMessageId = `temp-${Date.now()}`
    const userMessage: MessageResponse = {
      id: tempMessageId,
      role: 'user',
      content,
      imageUrl,
      createdAt: new Date().toISOString()
    }

    // Оптимистичное обновление
    setMessages(prev => [...prev, userMessage])
    
    try {
      const response = await chatApi.sendMessage(currentChat.id, content, imageUrl)
      const aiMessage = response.data
      
      // Заменить временное сообщение на реальное + добавить ответ AI
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== tempMessageId)
        return [...filtered, userMessage, aiMessage]
      })
      
      // Обновить счетчик сообщений в чате
      setChats(prev => prev.map(chat => 
        chat.id === currentChat.id 
          ? { ...chat, messageCount: chat.messageCount + 2 }
          : chat
      ))
    } catch (error) {
      // Откатить изменения
      setMessages(prev => prev.filter(msg => msg.id !== tempMessageId))
      const errorMessage = error instanceof Error ? error.message : 'Ошибка отправки сообщения'
      setError(errorMessage)
      console.error('Error sending message:', error)
      toast.error(errorMessage)
    }
  }

  const editMessage = async (messageId: string, content: string) => {
    if (!currentChat) return

    const originalMessage = messages.find(msg => msg.id === messageId)
    if (!originalMessage) return

    // Оптимистичное обновление
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content, isEdited: true, editedAt: new Date().toISOString() }
        : msg
    ))

    try {
      const response = await chatApi.editMessage(currentChat.id, messageId, content)
      const updatedMessage = response.data
      
      // Обновить с серверными данными
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? updatedMessage : msg
      ))
      
      toast.success('Сообщение отредактировано')
    } catch (error) {
      // Откатить изменения
      if (originalMessage) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? originalMessage : msg
        ))
      }
      const errorMessage = error instanceof Error ? error.message : 'Ошибка редактирования сообщения'
      setError(errorMessage)
      console.error('Error editing message:', error)
      toast.error(errorMessage)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!currentChat) return

    const deletedMessage = messages.find(msg => msg.id === messageId)
    if (!deletedMessage) return

    // Оптимистичное обновление
    setMessages(prev => prev.filter(msg => msg.id !== messageId))

    try {
      await chatApi.deleteMessage(currentChat.id, messageId)
      toast.success('Сообщение удалено')
    } catch (error) {
      // Откатить изменения
      if (deletedMessage) {
        setMessages(prev => [...prev, deletedMessage].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ))
      }
      const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления сообщения'
      setError(errorMessage)
      console.error('Error deleting message:', error)
      toast.error(errorMessage)
    }
  }

  const value: ChatContextType = {
    chats,
    currentChat,
    messages,
    loading,
    error,
    createChat,
    updateChat,
    deleteChat,
    selectChat,
    sendMessage,
    editMessage,
    deleteMessage,
    setCurrentChat,
    setMessages,
    clearError
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
