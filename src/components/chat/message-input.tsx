"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  ImageIcon,
  Send,
  X,
  Upload,
  Mic,
  MicOff,
  Play,
  Square,
  HelpCircle,
} from "lucide-react"
import { toast } from "sonner"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { KeyboardShortcutsDialog } from "./keyboard-shortcuts-dialog"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface MessageInputProps {
  onSendMessage: (content: string, imageUrl?: string, audioFile?: File) => void
  disabled?: boolean
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [audioPreview, setAudioPreview] = useState<string | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
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
    requestPermission,
  } = useAudioRecorder()

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  useEffect(() => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob)
      setAudioPreview(audioUrl)
      return () => URL.revokeObjectURL(audioUrl)
    }
  }, [audioBlob])

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setMessage(val)
    if (val === "/help") {
      setShortcutsOpen(true)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
        const formData = new FormData()
        formData.append("file", imageFile)
        formData.append("folder", "images")

        const res = await fetch("/api/upload", { method: "POST", body: formData })
        if (!res.ok) throw new Error("Ошибка загрузки изображения")

        const data = await res.json()
        imageUrl = data.url
        toast.success("Изображение загружено")
      } catch (err) {
        toast.error("Ошибка загрузки")
        return
      } finally {
        setIsUploading(false)
      }
    }

    let audioFile: File | undefined
    if (audioBlob) {
      audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" })
    }

    onSendMessage(message.trim(), imageUrl, audioFile)
    setMessage("")
    setImageFile(null)
    setImagePreview(null)
    clearRecording()
    setAudioPreview(null)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Только изображения")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Макс размер — 5MB")
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleAudioToggle = async () => {
    if (isRecording) {
      stopRecording()
    } else {
      if (!hasPermission) await requestPermission()
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

  const handleAudioEnded = () => setIsPlayingAudio(false)

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  const canSend = message.trim() || imageFile || audioBlob
  const isLoading = disabled || isUploading

  return (
    <div className="border-t border-[#2f2f2f] bg-[#212121]">
      <div className="max-w-3xl mx-auto p-3 space-y-3">
        {/* Image preview */}
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4 bg-[#2f2f2f] border-[#404040] backdrop-blur-sm transition-all">
            <div className="flex items-start gap-3">
              <Image
                src={imagePreview}
                alt="Preview"
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg border border-border/30"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{imageFile?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(imageFile?.size || 0) > 1024 * 1024
                    ? `${(imageFile!.size / 1024 / 1024).toFixed(1)} MB`
                    : `${Math.round((imageFile!.size || 0) / 1024)} KB`}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={removeImage}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
          </motion.div>
        )}

        {/* Audio preview */}
        {audioPreview && (
          <Card className="p-4 bg-card/60 border-border/40 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={playAudio}>
              {isPlayingAudio ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <div className="flex-1">
              <p className="text-sm font-medium">Голосовое сообщение</p>
              <p className="text-xs text-muted-foreground">{formatDuration(duration)}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={removeAudio}>
              <X className="w-4 h-4" />
            </Button>
            <audio ref={audioRef} src={audioPreview} onEnded={handleAudioEnded} className="hidden" />
          </Card>
        )}

        {/* Recording */}
        {isRecording && (
          <Card className="p-4 border border-red-500/30 bg-red-500/10 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
              <span className="text-sm font-medium text-red-500">Запись...</span>
              <div className="flex-1 text-right text-xs text-muted-foreground">
                {formatDuration(duration)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={stopRecording}
                className="text-red-500 hover:text-red-600"
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Input */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="Сообщение Radon AI..."
            className={cn(
              "min-h-[44px] max-h-[200px] resize-none pr-12 rounded-xl bg-[#2f2f2f]/80 backdrop-blur-md border-[#404040] text-white placeholder:text-[#8e8ea0] focus:border-[#10a37f] focus:ring-[#10a37f] transition-all duration-300 shadow-lg",
              imageFile || audioBlob ? "border-[#10a37f] focus:ring-[#10a37f] shadow-[0_0_20px_rgba(16,163,127,0.3)]" : ""
            )}
            disabled={isLoading}
            aria-label="Введите сообщение для Radon AI"
            aria-describedby="message-help"
          />

            <div className="absolute right-1 bottom-1 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-[#404040]/80 hover:text-white transition-all backdrop-blur-sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                aria-label="Прикрепить изображение"
                title="Прикрепить изображение"
              >
                <ImageIcon className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 transition-all backdrop-blur-sm",
                  isRecording ? "text-red-400 hover:text-red-300 hover:bg-red-500/20" : "hover:text-white hover:bg-[#404040]/80"
                )}
                onClick={handleAudioToggle}
                disabled={isLoading}
                aria-label={isRecording ? "Остановить запись" : "Начать запись голоса"}
                title={isRecording ? "Остановить запись" : "Начать запись голоса"}
              >
                {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShortcutsOpen(true)}
                className="h-7 w-7 hover:text-white hover:bg-[#404040]/80 backdrop-blur-sm transition-all"
                aria-label="Показать горячие клавиши"
                title="Показать горячие клавиши"
              >
                <HelpCircle className="w-3 h-3" />
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
            className={cn(
              "h-11 w-11 rounded-xl transition-all shrink-0",
              canSend && !isLoading
                ? "bg-[#10a37f] hover:bg-[#0d8f6b] text-white shadow-lg hover:shadow-xl backdrop-blur-md"
                : "bg-[#2f2f2f]/80 text-[#8e8ea0] cursor-not-allowed backdrop-blur-sm"
            )}
            aria-label="Отправить сообщение"
            title="Отправить сообщение (Enter)"
          >
            {isUploading ? (
              <Upload className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Footer hint */}
        <div className="flex justify-between mt-2 text-xs text-[#8e8ea0]" id="message-help">
          <span aria-live="polite">
            {imageFile
              ? "Изображение прикреплено"
              : audioBlob
              ? "Аудио готово к отправке"
              : "Поддерживаются изображения до 5MB и голосовые сообщения"}
          </span>
          <span>Enter — отправить • /help — справка</span>
        </div>
      </div>

      <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  )
}
