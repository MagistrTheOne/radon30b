/**
 * Улучшенная обработка ошибок для API
 */

export interface APIError {
  error: string
  details?: string
  code?: string
  status: number
}

export function createAPIError(
  message: string,
  status: number = 500,
  details?: string,
  code?: string
): APIError {
  return {
    error: message,
    details,
    code,
    status
  }
}

export function handleAPIError(error: unknown, defaultMessage = 'Internal server error'): APIError {
  console.error('API Error:', error)

  if (error instanceof Error) {
    // Проверяем известные типы ошибок
    if (error.message.includes('User not found')) {
      return createAPIError(
        'Пользователь не найден',
        404,
        'Пользователь не найден в базе данных. Возможно, нужно выполнить синхронизацию пользователей.',
        'USER_NOT_FOUND'
      )
    }

    if (error.message.includes('Chat not found')) {
      return createAPIError(
        'Чат не найден',
        404,
        'Запрашиваемый чат не существует или к нему нет доступа.',
        'CHAT_NOT_FOUND'
      )
    }

    if (error.message.includes('Unauthorized')) {
      return createAPIError(
        'Не авторизован',
        401,
        'Для выполнения этой операции требуется аутентификация.',
        'UNAUTHORIZED'
      )
    }

    if (error.message.includes('Prisma')) {
      return createAPIError(
        'Ошибка базы данных',
        500,
        'Произошла ошибка при работе с базой данных.',
        'DATABASE_ERROR'
      )
    }

    return createAPIError(error.message, 500, undefined, 'UNKNOWN_ERROR')
  }

  return createAPIError(defaultMessage, 500, undefined, 'UNKNOWN_ERROR')
}

export function isAPIError(obj: unknown): obj is APIError {
  return obj && typeof obj === 'object' && 'error' in obj && 'status' in obj
}
