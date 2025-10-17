'use client'

import { useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'

interface UseAudioRecorderReturn {
  isRecording: boolean
  audioBlob: Blob | null
  duration: number
  startRecording: () => Promise<void>
  stopRecording: () => void
  clearRecording: () => void
  hasPermission: boolean
  requestPermission: () => Promise<boolean>
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const [hasPermission, setHasPermission] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Ваш браузер не поддерживает запись аудио')
        return false
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      })
      
      setHasPermission(true)
      stream.getTracks().forEach(track => track.stop()) // Останавливаем сразу после проверки
      return true
    } catch (error) {
      console.error('Error requesting microphone permission:', error)
      setHasPermission(false)
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          toast.error('Доступ к микрофону запрещен. Разрешите доступ в настройках браузера')
        } else if (error.name === 'NotFoundError') {
          toast.error('Микрофон не найден. Подключите микрофон и попробуйте снова')
        } else {
          toast.error('Ошибка доступа к микрофону')
        }
      }
      
      return false
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      // Проверяем разрешения
      if (!hasPermission) {
        const granted = await requestPermission()
        if (!granted) return
      }

      // Получаем поток аудио
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      })

      streamRef.current = stream
      chunksRef.current = []

      // Создаем MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      mediaRecorderRef.current = mediaRecorder

      // Обработчики событий
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(audioBlob)
        
        // Останавливаем все треки
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }

      // Начинаем запись
      mediaRecorder.start(100) // Собираем данные каждые 100мс
      setIsRecording(true)
      startTimeRef.current = Date.now()

      // Запускаем таймер
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setDuration(elapsed)
        
        // Ограничиваем запись 5 минутами
        if (elapsed >= 300) {
          stopRecording()
          toast.warning('Максимальная длительность записи: 5 минут')
        }
      }, 1000)

      toast.success('Запись началась')
    } catch (error) {
      console.error('Error starting recording:', error)
      toast.error('Ошибка начала записи')
      setIsRecording(false)
    }
  }, [hasPermission, requestPermission])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      
      toast.success('Запись завершена')
    }
  }, [isRecording])

  const clearRecording = useCallback(() => {
    setAudioBlob(null)
    setDuration(0)
    chunksRef.current = []
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  return {
    isRecording,
    audioBlob,
    duration,
    startRecording,
    stopRecording,
    clearRecording,
    hasPermission,
    requestPermission
  }
}
