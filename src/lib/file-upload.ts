/**
 * File Upload API
 * Реальная реализация загрузки файлов вместо заглушек
 */

export interface UploadResponse {
  success: boolean
  url?: string
  error?: string
  metadata?: {
    size: number
    type: string
    duration?: number // для аудио
    width?: number    // для изображений
    height?: number   // для изображений
  }
}

export interface UploadOptions {
  maxSize?: number // в байтах
  allowedTypes?: string[]
  folder?: 'images' | 'audio' | 'documents'
}

/**
 * Загрузка файла на сервер
 */
export async function uploadFile(
  file: File, 
  options: UploadOptions = {}
): Promise<UploadResponse> {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB по умолчанию
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'audio/webm', 'audio/mp3', 'audio/wav'],
    folder = 'images'
  } = options

  try {
    // Проверка размера файла
    if (file.size > maxSize) {
      return {
        success: false,
        error: `Файл слишком большой. Максимальный размер: ${Math.round(maxSize / 1024 / 1024)}MB`
      }
    }

    // Проверка типа файла
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `Неподдерживаемый тип файла. Разрешены: ${allowedTypes.join(', ')}`
      }
    }

    // Создание FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    // Отправка на сервер
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.message || 'Ошибка загрузки файла'
      }
    }

    const result = await response.json()
    return {
      success: true,
      url: result.url,
      metadata: result.metadata
    }

  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: 'Ошибка сети при загрузке файла'
    }
  }
}

/**
 * Извлечение метаданных из аудио файла
 */
export async function extractAudioMetadata(file: File): Promise<{
  duration: number
  format: string
  bitrate?: number
}> {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    const url = URL.createObjectURL(file)

    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url)
      resolve({
        duration: audio.duration,
        format: file.type,
        bitrate: file.size / audio.duration // примерный битрейт
      })
    })

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url)
      reject(new Error('Не удалось загрузить аудио файл'))
    })

    audio.src = url
  })
}

/**
 * Извлечение метаданных из изображения
 */
export async function extractImageMetadata(file: File): Promise<{
  width: number
  height: number
  format: string
}> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.addEventListener('load', () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: file.type
      })
    })

    img.addEventListener('error', () => {
      URL.revokeObjectURL(url)
      reject(new Error('Не удалось загрузить изображение'))
    })

    img.src = url
  })
}

/**
 * Валидация файла перед загрузкой
 */
export function validateFile(file: File, options: UploadOptions = {}): {
  valid: boolean
  error?: string
} {
  const {
    maxSize = 10 * 1024 * 1024,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'audio/webm', 'audio/mp3', 'audio/wav']
  } = options

  // Проверка размера
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Файл слишком большой. Максимальный размер: ${Math.round(maxSize / 1024 / 1024)}MB`
    }
  }

  // Проверка типа
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Неподдерживаемый тип файла. Разрешены: ${allowedTypes.join(', ')}`
    }
  }

  return { valid: true }
}

/**
 * Сжатие изображения перед загрузкой
 */
export async function compressImage(
  file: File, 
  maxWidth: number = 1920, 
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Вычисляем новые размеры
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      // Рисуем сжатое изображение
      ctx?.drawImage(img, 0, 0, width, height)

      // Конвертируем в Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Ошибка сжатия изображения'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => reject(new Error('Не удалось загрузить изображение'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Предварительный просмотр файла
 */
export function createFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    
    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'))
    }
    
    reader.readAsDataURL(file)
  })
}
