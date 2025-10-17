"use client"

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { MessageList } from '@/components/chat/message-list'
import { MessageInput } from '@/components/chat/message-input'
import { useChatContext } from '@/contexts/ChatContext'
import { Message } from '@/types/chat'

export default function ChatPage() {
  const params = useParams()
  const chatId = params.chatId as string
  
  const { 
    messages, 
    loading, 
    sendMessage, 
    currentChat,
    loadChat
  } = useChatContext()

  // Загружаем чат при изменении chatId
  useEffect(() => {
    if (chatId && chatId !== currentChat?.id) {
      loadChat(chatId)
    }
  }, [chatId, currentChat?.id, loadChat])

  const handleSendMessage = async (content: string, imageUrl?: string, audioFile?: File) => {
    await sendMessage(content, imageUrl, audioFile)
  }

  // Конвертируем MessageResponse в Message для совместимости
  const convertedMessages: Message[] = messages.map(msg => ({
    id: msg.id,
    chatId: currentChat?.id || '',
    role: msg.role,
    content: msg.content,
    imageUrl: msg.imageUrl,
    audioUrl: msg.audioUrl,
    audioTranscription: msg.audioTranscription,
    audioDuration: msg.audioDuration,
    functionCalls: msg.functionCalls,
    personalityUsed: msg.personalityUsed,
    conversationId: msg.conversationId,
    createdAt: new Date(msg.createdAt),
    editedAt: msg.editedAt ? new Date(msg.editedAt) : undefined,
    isEdited: msg.isEdited
  }))

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={convertedMessages} isLoading={loading} />
      <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  )
}
