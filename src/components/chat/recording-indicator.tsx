'use client'

import { cn } from '@/lib/utils'

interface RecordingIndicatorProps {
  isRecording: boolean
  duration: number
  className?: string
}

export function RecordingIndicator({ isRecording, duration, className }: RecordingIndicatorProps) {
  if (!isRecording) return null

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn("flex items-center gap-2 text-red-500", className)}>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
      <span className="text-sm font-medium">Запись</span>
      <span className="text-xs text-muted-foreground">{formatDuration(duration)}</span>
    </div>
  )
}
