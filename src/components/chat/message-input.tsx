"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ImageIcon, Send, X, Upload, Mic, MicOff, Play, Square } from 'lucide-react'
import { toast } from 'sonner'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'

interface MessageInputProps {
  onSendMessage: (content: string, imageUrl?: string, audioFile?: File) => void
  disabled?: boolean
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [audioPreview, setAudioPreview] = useState<string | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const {
    isRecording,
    audioBlob,
    duration,
    startRecording,
    stopRecording,
    clearRecording,
    hasPermission,
    requestPermission
  } = useAudioRecorder()

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // Создаем preview аудио когда запись завершена
  useEffect(() => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob)
      setAudioPreview(audioUrl)
      return () => URL.revokeObjectURL(audioUrl)
    }
  }, [audioBlob])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = async () => {
    if (!message.trim() && !imageFile && !audioBlob) return

    let imageUrl: string | undefined

    if (imageFile) {
      try {
        setIsUploading(true)
        
        // Используем реальный API загрузки
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('folder', 'images')
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Ошибка загрузки файла')
        }
        
        const data = await response.json()
        imageUrl = data.url
        
        toast.success('Изображение загружено успешно')
        
      } catch (error) {
        console.error('Error uploading image:', error)
        toast.error(error instanceof Error ? error.message : 'Ошибка загрузки изображения')
        return
      } finally {
        setIsUploading(false)
      }
    }

    // Создаем File из audioBlob для отправки
    let audioFile: File | undefined
    if (audioBlob) {
      audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' })
    }

    onSendMessage(message.trim(), imageUrl, audioFile)
    setMessage('')
    setImageFile(null)
    setImagePreview(null)
    clearRecording()
    setAudioPreview(null)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 5MB')
      return
    }

    setImageFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAudioToggle = async () => {
    if (isRecording) {
      stopRecording()
    } else {
      if (!hasPermission) {
        await requestPermission()
      }
      await startRecording()
    }
  }

  const removeAudio = () => {
    clearRecording()
    setAudioPreview(null)
  }

  const playAudio = () => {
    if (audioRef.current && audioPreview) {
      if (isPlayingAudio) {
        audioRef.current.pause()
        setIsPlayingAudio(false)
      } else {
        audioRef.current.play()
        setIsPlayingAudio(true)
      }
    }
  }

  const handleAudioEnded = () => {
    setIsPlayingAudio(false)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const canSend = message.trim() || imageFile || audioBlob
  const isLoading = disabled || isUploading

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-4xl mx-auto p-4">
        {/* Image Preview */}
        {imagePreview && (
          <Card className="mb-4 p-4">
            <div className="flex items-start gap-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{imageFile?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(imageFile?.size || 0) / 1024 / 1024 < 1
                    ? `${Math.round((imageFile?.size || 0) / 1024)} KB`
                    : `${Math.round((imageFile?.size || 0) / 1024 / 1024 * 10) / 10} MB`
                  }
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeImage}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Audio Preview */}
        {audioPreview && (
          <Card className="mb-4 p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={playAudio}
                className="h-10 w-10"
              >
                {isPlayingAudio ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <div className="flex-1">
                <p className="text-sm font-medium">Голосовое сообщение</p>
                <p className="text-xs text-muted-foreground">
                  {formatDuration(duration)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeAudio}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <audio
              ref={audioRef}
              src={audioPreview}
              onEnded={handleAudioEnded}
              className="hidden"
            />
          </Card>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <Card className="mb-4 p-4 border-red-500/50 bg-red-500/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-red-500">Запись...</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {formatDuration(duration)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={stopRecording}
                className="h-8 w-8 text-red-500 hover:text-red-600"
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Input Area */}
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишите сообщение... (Shift+Enter для новой строки)"
              className="min-h-[60px] max-h-[200px] resize-none pr-12"
              disabled={isLoading}
            />
            
            <div className="absolute right-2 bottom-2 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${isRecording ? 'text-red-500' : ''}`}
                onClick={handleAudioToggle}
                disabled={isLoading}
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={!canSend || isLoading}
            size="icon"
            className="h-12 w-12"
          >
            {isUploading ? (
              <Upload className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>
            {imageFile ? 'Изображение готово к отправке' : 
             audioBlob ? 'Аудио готово к отправке' :
             'Поддерживаются изображения до 5MB и голосовые сообщения'}
          </span>
          <span>Enter для отправки • Shift+Enter для новой строки</span>
        </div>
      </div>
    </div>
  )
}
