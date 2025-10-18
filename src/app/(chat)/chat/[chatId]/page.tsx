"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
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
    loadChat,
    error,
  } = useChatContext()

  const [isLoading, setIsLoading] = useState(loading)
  
  // загружаем чат при изменении chatId
  useEffect(() => {
    if (chatId && chatId !== currentChat?.id) {
      setIsLoading(true)
      loadChat(chatId)
    }
  }, [chatId, currentChat?.id, loadChat])

  const handleSendMessage = async (content: string, imageUrl?: string, audioFile?: File) => {
    await sendMessage(content, imageUrl, audioFile)
  }

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
    isEdited: msg.isEdited,
  }))

  // Функция для обработки ошибок
  const renderError = () => {
    if (error) {
      return (
        <div className="text-center text-red-500">
          <p>Ошибка загрузки чата. Попробуйте снова.</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f]">
      {/* message zone */}
      <motion.div
        className="flex-1 overflow-y-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {renderError()}
        <MessageList messages={convertedMessages} isLoading={isLoading} />
      </motion.div>

      {/* input zone */}
      <motion.div
        className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </motion.div>
    </div>
  )
}
