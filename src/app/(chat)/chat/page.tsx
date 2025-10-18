"use client"

import { MessageList } from "@/components/chat/message-list"
import { MessageInput } from "@/components/chat/message-input"
import { useChatContext } from "@/contexts/ChatContext"
import { Message } from "@/types/chat"
import { motion } from "framer-motion"
import { Bot } from "lucide-react"

export default function ChatPage() {
  const {
    messages,
    loading,
    sendMessage,
    currentChat,
  } = useChatContext()

  const handleSendMessage = async (
    content: string,
    imageUrl?: string,
    audioFile?: File
  ) => {
    await sendMessage(content, imageUrl, audioFile)
  }

  // Конвертация MessageResponse → Message с проверками
  const convertedMessages: Message[] = messages?.map((msg) => ({
    id: msg.id,
    chatId: currentChat?.id || "",
    role: msg.role,
    content: msg.content || "",
    imageUrl: msg.imageUrl,
    audioUrl: msg.audioUrl,
    createdAt: new Date(msg.createdAt),
    editedAt: msg.editedAt ? new Date(msg.editedAt) : undefined,
    isEdited: msg.isEdited,
  })) || []

  if (!currentChat) {
    return (
      <div className="flex flex-col h-full bg-[#0f0f0f]">
        <div className="flex flex-1 flex-col items-center justify-center text-center text-gray-400 p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center max-w-md"
          >
            <div className="w-20 h-20 mb-6 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
              <Bot className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-200 mb-3">
              Добро пожаловать в Radon AI
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Начните новый разговор или выберите существующий чат из боковой панели
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f]">
      <MessageList messages={convertedMessages} isLoading={loading} />
      <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  )
}
