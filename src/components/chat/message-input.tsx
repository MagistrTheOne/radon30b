"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ImageIcon, Send, X, Upload } from 'lucide-react'
import { toast } from 'sonner'

interface MessageInputProps {
  onSendMessage: (content: string, imageUrl?: string) => void
  disabled?: boolean
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = async () => {
    if (!message.trim() && !imageFile) return

    let imageUrl: string | undefined

    if (imageFile) {
      try {
        setIsUploading(true)
        // TODO: Replace with actual file upload API
        // const formData = new FormData()
        // formData.append('file', imageFile)
        // const response = await apiClient.post('/api/upload', formData)
        // imageUrl = response.data.url
        
        // Mock upload for now
        await new Promise(resolve => setTimeout(resolve, 1000))
        imageUrl = URL.createObjectURL(imageFile)
      } catch (error) {
        toast.error('Ошибка загрузки изображения')
        return
      } finally {
        setIsUploading(false)
      }
    }

    onSendMessage(message.trim(), imageUrl)
    setMessage('')
    setImageFile(null)
    setImagePreview(null)
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

  const canSend = message.trim() || imageFile
  const isLoading = disabled || isUploading

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            
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
            {imageFile ? 'Изображение готово к отправке' : 'Поддерживаются изображения до 5MB'}
          </span>
          <span>Enter для отправки • Shift+Enter для новой строки</span>
        </div>
      </div>
    </div>
  )
}
