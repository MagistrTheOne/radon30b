export interface UploadConfig {
  maxFileSize: number
  allowedFileTypes: string[]
  maxFilesPerMessage: number
  uploadDir: string
}

export const UPLOAD_CONFIG: UploadConfig = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,audio/webm,audio/mp3,audio/wav').split(','),
  maxFilesPerMessage: parseInt(process.env.MAX_FILES_PER_MESSAGE || '3'),
  uploadDir: process.env.UPLOAD_DIR || '/tmp/uploads'
}
