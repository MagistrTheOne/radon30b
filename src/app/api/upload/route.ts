import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'images'

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      )
    }

    // Валидация размера файла (10MB максимум)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Файл слишком большой. Максимальный размер: 10MB' },
        { status: 400 }
      )
    }

    // Валидация типа файла
    const allowedTypes = {
      images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      audio: ['audio/webm', 'audio/mp3', 'audio/wav', 'audio/ogg'],
      documents: ['application/pdf', 'text/plain', 'application/msword']
    }

    const allowedTypesForFolder = allowedTypes[folder as keyof typeof allowedTypes] || allowedTypes.images
    if (!allowedTypesForFolder.includes(file.type)) {
      return NextResponse.json(
        { error: `Неподдерживаемый тип файла для папки ${folder}` },
        { status: 400 }
      )
    }

    // Создание уникального имени файла
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}_${randomString}.${fileExtension}`

    // Путь к папке загрузок
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder)
    
    // Создание папки если не существует
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Путь к файлу
    const filePath = join(uploadDir, fileName)
    
    // Конвертация файла в буфер
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Сохранение файла
    await writeFile(filePath, buffer)

    // URL файла
    const fileUrl = `/uploads/${folder}/${fileName}`

    // Метаданные файла
    const metadata: {
      size: number
      type: string
      name: string
      uploadedAt: string
      duration?: number
      bitrate?: number
      sampleRate?: number
      channels?: number
      width?: number
      height?: number
    } = {
      size: file.size,
      type: file.type,
      name: file.name,
      uploadedAt: new Date().toISOString()
    }

    // Дополнительные метаданные для аудио
    if (folder === 'audio') {
      try {
        // Извлекаем реальные метаданные аудио
        const { extractAudioMetadata } = await import('@/lib/audio-metadata')
        const audioMetadata = await extractAudioMetadata(file)
        metadata.duration = audioMetadata.duration
        metadata.bitrate = audioMetadata.bitrate
        metadata.sampleRate = audioMetadata.sampleRate
        metadata.channels = audioMetadata.channels
      } catch (error) {
        console.error('Error extracting audio metadata:', error)
        // Fallback к примерному значению
        metadata.duration = Math.round(file.size / 32000) // примерная длительность
      }
    }

    // Дополнительные метаданные для изображений
    if (folder === 'images') {
      // TODO: Извлечь реальные размеры изображения
      metadata.width = 1920 // временная заглушка
      metadata.height = 1080 // временная заглушка
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      metadata
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки файла' },
      { status: 500 }
    )
  }
}
