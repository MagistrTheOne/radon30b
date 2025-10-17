"use client"

import { MessageList } from '@/components/chat/message-list'
import { MessageInput } from '@/components/chat/message-input'
import { useState } from 'react'
import { Message } from '@/types/chat'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      chatId: 'current',
      role: 'user',
      content,
      imageUrl,
      createdAt: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.post('/api/chats/current/messages', {
      //   content,
      //   imageUrl
      // })

      // Mock AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          chatId: 'current',
          role: 'assistant',
          content: `Это демо-ответ от Radon AI. Вы написали: "${content}". В реальной версии здесь будет ответ от нейросети 30B параметров.`,
          createdAt: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      console.error('Error sending message:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  )
}
