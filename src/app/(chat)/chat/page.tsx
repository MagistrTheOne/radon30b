"use client"

import { MessageList } from '@/components/chat/message-list'
import { MessageInput } from '@/components/chat/message-input'
import { useChatContext } from '@/contexts/ChatContext'
import { Message } from '@/types/chat'

export default function ChatPage() {
  const { 
    messages, 
    loading, 
    sendMessage, 
    currentChat 
  } = useChatContext()

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    await sendMessage(content, imageUrl)
  }

  // Конвертируем MessageResponse в Message для совместимости
  const convertedMessages: Message[] = messages.map(msg => ({
    id: msg.id,
    chatId: currentChat?.id || '',
    role: msg.role,
    content: msg.content,
    imageUrl: msg.imageUrl,
    createdAt: new Date(msg.createdAt),
    editedAt: msg.editedAt ? new Date(msg.editedAt) : undefined,
    isEdited: msg.isEdited
  }))

  return (
    <div className="flex flex-col h-full chat-background">
      <MessageList messages={convertedMessages} isLoading={loading} />
      <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  )
}
