'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AudioWaveformProps {
  audioUrl: string
  className?: string
  height?: number
  color?: string
}

export function AudioWaveform({ 
  audioUrl, 
  className, 
  height = 40, 
  color = 'hsl(var(--primary))' 
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!audioUrl || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Создаем аудио элемент для анализа
    // const audio = new Audio(audioUrl) // Не используется в текущей реализации
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    
    let source: AudioBufferSourceNode | null = null
    let analyser: AnalyserNode | null = null

    const drawWaveform = () => {
      if (!analyser || !ctx) return

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)

      // Очищаем canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Рисуем waveform
      const barWidth = canvas.width / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height
        
        ctx.fillStyle = color
        ctx.fillRect(x, height - barHeight, barWidth, barHeight)
        
        x += barWidth + 1
      }

      requestAnimationFrame(drawWaveform)
    }

    const loadAudio = async () => {
      try {
        const response = await fetch(audioUrl)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        
        source = audioContext.createBufferSource()
        source.buffer = audioBuffer
        
        analyser = audioContext.createAnalyser()
        analyser.fftSize = 256
        
        source.connect(analyser)
        analyser.connect(audioContext.destination)
        
        setIsLoaded(true)
        drawWaveform()
      } catch (error) {
        console.error('Error loading audio for waveform:', error)
        // Fallback - рисуем статичную waveform
        drawStaticWaveform()
      }
    }

    const drawStaticWaveform = () => {
      if (!ctx) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const barCount = 50
      const barWidth = canvas.width / barCount
      
      for (let i = 0; i < barCount; i++) {
        const barHeight = Math.random() * height * 0.8 + height * 0.2
        ctx.fillStyle = color
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight)
      }
      
      setIsLoaded(true)
    }

    loadAudio()

    return () => {
      if (source) {
        source.stop()
      }
      if (audioContext.state !== 'closed') {
        audioContext.close()
      }
    }
  }, [audioUrl, height, color])

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={height}
      className={cn("rounded", className)}
      style={{ opacity: isLoaded ? 1 : 0.5 }}
    />
  )
}
