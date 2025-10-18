"use client"

import { MessageList } from "@/components/chat/message-list"
import { MessageInput } from "@/components/chat/message-input"
import { WelcomeScreen } from "@/components/chat/welcome-screen"
import { useChatContext } from "@/contexts/ChatContext"
import { Message } from "@/types/chat"

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
      <div className="flex flex-col h-full bg-[#212121]">
        <WelcomeScreen />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#212121]">
      <MessageList messages={convertedMessages} isLoading={loading} />
      <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  )
}
