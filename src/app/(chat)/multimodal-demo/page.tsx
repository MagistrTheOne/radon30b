'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MultimodalInput } from '@/components/chat/multimodal-input'
import { MultimodalResponse } from '@/components/chat/multimodal-response'
import { useMultimodalChat } from '@/hooks/use-multimodal-chat'
import { 
  Mic, 
  Image as ImageIcon, 
  Video, 
  FileAudio, 
  Sparkles,
  Trash2,
  Download
} from 'lucide-react'
import { toast } from 'sonner'

export default function MultimodalDemoPage() {
  const [conversationId] = useState(`demo_${Date.now()}`)
  const { messages, isLoading, sendMessage, clearMessages } = useMultimodalChat({
    conversationId,
    onError: (error) => {
      console.error('Multimodal chat error:', error)
      toast.error(`Ошибка: ${error}`)
    }
  })

  const handleSendMessage = async (data: {
    text?: string
    image?: File
    audio?: File
    video?: File
    personality?: string
    responseFormat?: 'text' | 'speech' | 'both'
  }) => {
    await sendMessage(data)
  }

  const downloadConversation = () => {
    const conversationData = {
      conversationId,
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        personality: msg.personality,
        timestamp: msg.timestamp,
        hasMedia: !!(msg.imageUrl || msg.audioUrl || msg.videoUrl)
      }))
    }

    const blob = new Blob([JSON.stringify(conversationData, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `radon_conversation_${conversationId}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full bg-[#212121]">
      {/* Заголовок */}
      <div className="border-b border-[#2f2f2f] bg-[#171717] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#10a37f] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                Radon AI Multimodal Demo
              </h1>
              <p className="text-sm text-[#8e8ea0]">
                Основан на Qwen3-Omni-30B-A3B-Instruct
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[#2f2f2f] text-white">
              {messages.length} сообщений
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadConversation}
              className="text-[#8e8ea0] hover:text-white"
            >
              <Download className="w-4 h-4 mr-1" />
              Экспорт
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="text-[#8e8ea0] hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Очистить
            </Button>
          </div>
        </div>
      </div>

      {/* Возможности */}
      <div className="border-b border-[#2f2f2f] bg-[#171717] p-4">
        <div className="flex flex-wrap gap-4 text-sm text-[#8e8ea0]">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Изображения (PNG, JPEG, WebP)</span>
          </div>
          <div className="flex items-center gap-2">
            <FileAudio className="w-4 h-4" />
            <span>Аудио (WAV, MP3, M4A)</span>
          </div>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span>Видео (MP4, AVI, MOV)</span>
          </div>
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            <span>Голосовые ответы</span>
          </div>
        </div>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 mb-6 rounded-full bg-[#2f2f2f]/80 border border-[#404040] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#10a37f]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Добро пожаловать в Radon AI Multimodal!
            </h3>
            <p className="text-[#8e8ea0] mb-4 max-w-md">
              Отправьте текст, изображение, аудио или видео. Radon AI понимает все форматы 
              и может отвечать текстом или голосом.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge className="bg-[#10a37f]/20 text-[#10a37f]">
                🤖 30B параметров
              </Badge>
              <Badge className="bg-[#10a37f]/20 text-[#10a37f]">
                🌍 119 языков
              </Badge>
              <Badge className="bg-[#10a37f]/20 text-[#10a37f]">
                🎤 19 языков речи
              </Badge>
              <Badge className="bg-[#10a37f]/20 text-[#10a37f]">
                🎵 Анализ музыки
              </Badge>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MultimodalResponse
              key={message.id}
              content={message.content}
              imageUrl={message.imageUrl}
              audioUrl={message.audioUrl}
              videoUrl={message.videoUrl}
              personality={message.personality}
              timestamp={message.timestamp}
              isUser={message.role === 'user'}
            />
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2f2f2f] flex items-center justify-center">
              🤖
            </div>
            <Card className="p-4 bg-[#2f2f2f]/80 border-[#404040] backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#10a37f]/30 border-t-[#10a37f] rounded-full animate-spin" />
                <span className="text-[#8e8ea0]">Radon AI обрабатывает...</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Ввод */}
      <div className="border-t border-[#2f2f2f] bg-[#171717] p-4">
        <MultimodalInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          conversationId={conversationId}
        />
      </div>
    </div>
  )
}
