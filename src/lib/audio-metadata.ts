/**
 * Audio Metadata Extraction
 * Извлечение метаданных из аудио файлов
 */

export interface AudioMetadata {
  duration: number
  format: string
  bitrate?: number
  sampleRate?: number
  channels?: number
  size: number
}

/**
 * Извлечение метаданных из аудио файла
 */
export async function extractAudioMetadata(file: File): Promise<AudioMetadata> {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    const url = URL.createObjectURL(file)

    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url)
      
      // Получаем дополнительную информацию из файла
      const format = file.type || 'audio/unknown'
      const size = file.size
      
      // Примерный битрейт (размер файла / длительность)
      const bitrate = size / audio.duration

      resolve({
        duration: Math.round(audio.duration),
        format,
        bitrate: Math.round(bitrate),
        size,
        // Дополнительные метаданные можно получить через Web Audio API
        sampleRate: 44100, // по умолчанию
        channels: 2 // по умолчанию
      })
    })

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url)
      reject(new Error('Не удалось загрузить аудио файл для извлечения метаданных'))
    })

    audio.src = url
  })
}

/**
 * Извлечение метаданных через Web Audio API (более детально)
 */
export async function extractDetailedAudioMetadata(file: File): Promise<AudioMetadata> {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      
      const metadata: AudioMetadata = {
        duration: Math.round(audioBuffer.duration),
        format: file.type || 'audio/unknown',
        size: file.size,
        sampleRate: audioBuffer.sampleRate,
        channels: audioBuffer.numberOfChannels,
        bitrate: Math.round(file.size / audioBuffer.duration)
      }

      audioContext.close()
      resolve(metadata)
      
    } catch (error) {
      // Fallback к простому методу
      try {
        const simpleMetadata = await extractAudioMetadata(file)
        resolve(simpleMetadata)
      } catch {
        reject(new Error('Не удалось извлечь метаданные аудио'))
      }
    }
  })
}

/**
 * Валидация аудио файла
 */
export function validateAudioFile(file: File): {
  valid: boolean
  error?: string
} {
  const maxSize = 25 * 1024 * 1024 // 25MB
  const allowedTypes = [
    'audio/webm',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/m4a',
    'audio/aac'
  ]

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Файл слишком большой. Максимальный размер: ${Math.round(maxSize / 1024 / 1024)}MB`
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Неподдерживаемый формат аудио. Разрешены: ${allowedTypes.join(', ')}`
    }
  }

  return { valid: true }
}

/**
 * Сжатие аудио файла (если поддерживается)
 */
export async function compressAudio(
  file: File, 
  quality: number = 0.7
): Promise<File> {
  // Для WebM можно использовать MediaRecorder API
  if (file.type === 'audio/webm') {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      const url = URL.createObjectURL(file)
      
      audio.onloadeddata = () => {
        // Создаем MediaRecorder для сжатия
        const stream = new MediaStream()
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
          audioBitsPerSecond: Math.round(128000 * quality) // 128kbps * quality
        })
        
        const chunks: BlobPart[] = []
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data)
          }
        }
        
        mediaRecorder.onstop = () => {
          const compressedBlob = new Blob(chunks, { type: 'audio/webm' })
          const compressedFile = new File([compressedBlob], file.name, {
            type: 'audio/webm',
            lastModified: Date.now()
          })
          
          URL.revokeObjectURL(url)
          resolve(compressedFile)
        }
        
        mediaRecorder.start()
        setTimeout(() => mediaRecorder.stop(), audio.duration * 1000)
      }
      
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Ошибка загрузки аудио для сжатия'))
      }
      
      audio.src = url
    })
  }
  
  // Для других форматов возвращаем оригинал
  return file
}

/**
 * Форматирование длительности в читаемый вид
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * Получение размера файла в читаемом виде
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}
