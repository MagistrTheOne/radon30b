'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  Video, 
  FileAudio, 
  Send, 
  X,
  Volume2,
  VolumeX
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface MultimodalInputProps {
  onSendMessage: (data: {
    text?: string
    image?: File
    audio?: File
    video?: File
    personality?: string
    responseFormat?: 'text' | 'speech' | 'both'
  }) => Promise<void>
  disabled?: boolean
  conversationId?: string
}

export function MultimodalInput({ 
  onSendMessage, 
  disabled = false, 
  conversationId 
}: MultimodalInputProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<{
    image?: File
    audio?: File
    video?: File
  }>({})
  const [personality, setPersonality] = useState('helpful')
  const [responseFormat, setResponseFormat] = useState<'text' | 'speech' | 'both'>('text')
  const [isLoading, setIsLoading] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const personalities = [
    { id: 'helpful', name: 'Помощник', emoji: '🤝' },
    { id: 'creative', name: 'Креативщик', emoji: '🎨' },
    { id: 'analytical', name: 'Аналитик', emoji: '📊' },
    { id: 'friendly', name: 'Друг', emoji: '😊' },
    { id: 'professional', name: 'Профессионал', emoji: '💼' }
  ]

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileType = file.type.split('/')[0]
    const maxSizes = {
      image: 10 * 1024 * 1024, // 10MB
      audio: 25 * 1024 * 1024, // 25MB
      video: 100 * 1024 * 1024 // 100MB
    }

    if (file.size > maxSizes[fileType as keyof typeof maxSizes]) {
      toast.error(`Файл слишком большой. Максимум: ${maxSizes[fileType as keyof typeof maxSizes] / 1024 / 1024}MB`)
      return
    }

    setAttachedFiles(prev => ({
      ...prev,
      [fileType]: file
    }))

    toast.success(`${fileType === 'image' ? 'Изображение' : fileType === 'audio' ? 'Аудио' : 'Видео'} прикреплено`)
  }, [])

  const removeFile = useCallback((type: 'image' | 'audio' | 'video') => {
    setAttachedFiles(prev => {
      const newFiles = { ...prev }
      delete newFiles[type]
      return newFiles
    })
    toast.success('Файл удален')
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' })
        setAttachedFiles(prev => ({ ...prev, audio: audioFile }))
        toast.success('Запись завершена')
        
        // Останавливаем все треки
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      toast.success('Запись начата...')
    } catch (error) {
      console.error('Error starting recording:', error)
      toast.error('Не удалось начать запись')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const handleSend = useCallback(async () => {
    if (!message.trim() && !attachedFiles.image && !attachedFiles.audio && !attachedFiles.video) {
      toast.error('Введите сообщение или прикрепите файл')
      return
    }

    setIsLoading(true)
    try {
      await onSendMessage({
        text: message.trim() || undefined,
        image: attachedFiles.image,
        audio: attachedFiles.audio,
        video: attachedFiles.video,
        personality,
        responseFormat
      })

      // Очищаем форму
      setMessage('')
      setAttachedFiles({})
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Ошибка отправки сообщения')
    } finally {
      setIsLoading(false)
    }
  }, [message, attachedFiles, personality, responseFormat, onSendMessage])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const canSend = message.trim() || attachedFiles.image || attachedFiles.audio || attachedFiles.video

  return (
    <div className="space-y-4">
      {/* Настройки */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#8e8ea0]">Личность:</span>
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="bg-[#2f2f2f] border border-[#404040] rounded-lg px-2 py-1 text-sm text-white"
          >
            {personalities.map(p => (
              <option key={p.id} value={p.id}>
                {p.emoji} {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[#8e8ea0]">Ответ:</span>
          <div className="flex gap-1">
            {(['text', 'speech', 'both'] as const).map(format => (
              <Button
                key={format}
                variant={responseFormat === format ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setResponseFormat(format)}
                className={cn(
                  "h-7 px-2 text-xs",
                  responseFormat === format 
                    ? "bg-[#10a37f] text-white" 
                    : "text-[#8e8ea0] hover:text-white"
                )}
              >
                {format === 'text' && '📝'}
                {format === 'speech' && '🎤'}
                {format === 'both' && '📝🎤'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Прикрепленные файлы */}
      {(attachedFiles.image || attachedFiles.audio || attachedFiles.video) && (
        <div className="flex flex-wrap gap-2">
          {attachedFiles.image && (
            <Badge variant="secondary" className="bg-[#2f2f2f] text-white">
              <ImageIcon className="w-3 h-3 mr-1" />
              {attachedFiles.image.name}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile('image')}
                className="h-4 w-4 p-0 ml-1 hover:bg-red-500/20"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {attachedFiles.audio && (
            <Badge variant="secondary" className="bg-[#2f2f2f] text-white">
              <FileAudio className="w-3 h-3 mr-1" />
              {attachedFiles.audio.name}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile('audio')}
                className="h-4 w-4 p-0 ml-1 hover:bg-red-500/20"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {attachedFiles.video && (
            <Badge variant="secondary" className="bg-[#2f2f2f] text-white">
              <Video className="w-3 h-3 mr-1" />
              {attachedFiles.video.name}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile('video')}
                className="h-4 w-4 p-0 ml-1 hover:bg-red-500/20"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      {/* Основной ввод */}
      <Card className="p-4 bg-[#2f2f2f]/80 border-[#404040] backdrop-blur-md">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите сообщение или прикрепите файл..."
            className={cn(
              "flex-1 min-h-[44px] max-h-[200px] resize-none rounded-xl",
              "bg-[#2f2f2f]/80 border-[#404040] text-white placeholder:text-[#8e8ea0]",
              "focus:border-[#10a37f] focus:ring-[#10a37f] transition-all duration-300"
            )}
            disabled={disabled || isLoading}
          />
          
          <div className="flex flex-col gap-1">
            {/* Кнопки прикрепления файлов */}
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isLoading}
                className="h-8 w-8 hover:bg-[#404040]/80"
                title="Прикрепить файл"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={disabled || isLoading}
                className={cn(
                  "h-8 w-8",
                  isRecording 
                    ? "text-red-400 hover:bg-red-500/20" 
                    : "hover:bg-[#404040]/80"
                )}
                title={isRecording ? "Остановить запись" : "Записать голос"}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>

            {/* Кнопка отправки */}
            <Button
              onClick={handleSend}
              disabled={!canSend || disabled || isLoading}
              className={cn(
                "h-8 w-8 rounded-xl transition-all",
                canSend && !isLoading
                  ? "bg-[#10a37f] hover:bg-[#0d8f6b] text-white"
                  : "bg-[#2f2f2f]/80 text-[#8e8ea0] cursor-not-allowed"
              )}
              title="Отправить (Enter)"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Скрытый input для файлов */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,audio/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </Card>
    </div>
  )
}
