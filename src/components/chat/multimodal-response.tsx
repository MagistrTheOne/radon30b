'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download,
  Image as ImageIcon,
  FileAudio,
  Video,
  Eye,
  EyeOff
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MultimodalResponseProps {
  content: string
  imageUrl?: string
  audioUrl?: string
  videoUrl?: string
  personality?: string
  timestamp: string
  isUser?: boolean
}

export function MultimodalResponse({
  content,
  imageUrl,
  audioUrl,
  videoUrl,
  personality,
  timestamp,
  isUser = false
}: MultimodalResponseProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const personalities = {
    helpful: { name: 'Помощник', emoji: '🤝', color: 'bg-blue-500/20 text-blue-300' },
    creative: { name: 'Креативщик', emoji: '🎨', color: 'bg-purple-500/20 text-purple-300' },
    analytical: { name: 'Аналитик', emoji: '📊', color: 'bg-green-500/20 text-green-300' },
    friendly: { name: 'Друг', emoji: '😊', color: 'bg-yellow-500/20 text-yellow-300' },
    professional: { name: 'Профессионал', emoji: '💼', color: 'bg-gray-500/20 text-gray-300' }
  }

  const personalityInfo = personality ? personalities[personality as keyof typeof personalities] : null

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    const audio = audioRef.current
    const video = videoRef.current

    const handleEnded = () => setIsPlaying(false)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    if (audio) {
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('play', handlePlay)
      audio.addEventListener('pause', handlePause)
    }

    if (video) {
      video.addEventListener('ended', handleEnded)
      video.addEventListener('play', handlePlay)
      video.addEventListener('pause', handlePause)
    }

    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('play', handlePlay)
        audio.removeEventListener('pause', handlePause)
      }
      if (video) {
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('pause', handlePause)
      }
    }
  }, [])

  return (
    <div className={cn(
      "flex gap-3 max-w-4xl",
      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      {/* Аватар */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        isUser 
          ? "bg-[#10a37f] text-white" 
          : "bg-[#2f2f2f] text-[#10a37f]"
      )}>
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Контент */}
      <div className={cn(
        "flex flex-col gap-2 min-w-0",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Метаданные */}
        <div className="flex items-center gap-2 text-xs text-[#8e8ea0]">
          {personalityInfo && (
            <Badge className={cn("text-xs", personalityInfo.color)}>
              {personalityInfo.emoji} {personalityInfo.name}
            </Badge>
          )}
          <span>{new Date(timestamp).toLocaleTimeString()}</span>
        </div>

        {/* Основной контент */}
        <Card className={cn(
          "p-4 max-w-full",
          isUser 
            ? "bg-[#10a37f] text-white" 
            : "bg-[#2f2f2f]/80 border-[#404040] text-white backdrop-blur-md"
        )}>
          {/* Текстовый контент */}
          {content && (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg border border-[#404040]"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="px-1 py-0.5 bg-[#404040] rounded text-sm" {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}

          {/* Медиа контент */}
          <div className="mt-4 space-y-3">
            {/* Изображение */}
            {imageUrl && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#8e8ea0]" />
                  <span className="text-sm text-[#8e8ea0]">Изображение</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImage(!showImage)}
                    className="h-6 px-2 text-xs"
                  >
                    {showImage ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadFile(imageUrl, 'radon_image.jpg')}
                    className="h-6 px-2 text-xs"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
                {showImage && (
                  <img
                    src={imageUrl}
                    alt="Radon AI response"
                    className="max-w-full h-auto rounded-lg border border-[#404040]"
                  />
                )}
              </div>
            )}

            {/* Аудио */}
            {audioUrl && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileAudio className="w-4 h-4 text-[#8e8ea0]" />
                  <span className="text-sm text-[#8e8ea0]">Аудио ответ</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAudio}
                    className="h-6 px-2 text-xs"
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="h-6 px-2 text-xs"
                  >
                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadFile(audioUrl, 'radon_audio.wav')}
                    className="h-6 px-2 text-xs"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  className="w-full"
                  controls
                  preload="metadata"
                />
              </div>
            )}

            {/* Видео */}
            {videoUrl && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#8e8ea0]" />
                  <span className="text-sm text-[#8e8ea0]">Видео</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowVideo(!showVideo)}
                    className="h-6 px-2 text-xs"
                  >
                    {showVideo ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadFile(videoUrl, 'radon_video.mp4')}
                    className="h-6 px-2 text-xs"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
                {showVideo && (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="max-w-full h-auto rounded-lg border border-[#404040]"
                    controls
                    preload="metadata"
                  />
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
