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
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-16 h-16 mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Ошибка загрузки чата</h3>
          <p className="text-[#8e8ea0] mb-4">Не удалось загрузить чат. Попробуйте снова.</p>
          <button 
            onClick={() => loadChat(chatId)}
            className="px-4 py-2 bg-[#10a37f] hover:bg-[#0d8a6b] text-white rounded-lg transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col h-full bg-[#212121]">
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
        className="border-t border-[#2f2f2f] bg-[#212121]"
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
