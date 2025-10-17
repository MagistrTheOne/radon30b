/**
 * Subscription Management API
 * Реальная реализация управления подписками
 */

export interface Subscription {
  id: string
  userId: string
  tier: 'free' | 'pro' | 'team' | 'enterprise'
  status: 'active' | 'cancelled' | 'expired' | 'past_due'
  currentPeriodEnd: string | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  createdAt: string
  updatedAt: string
}

export interface UsageStats {
  messagesUsed: number
  messagesLimit: number
  tokensUsed: number
  tokensLimit: number
  lastReset: string
}

export interface SubscriptionLimits {
  free: {
    messagesPerMonth: number
    tokensPerMonth: number
    maxFileSize: number
    maxFilesPerMessage: number
    features: string[]
  }
  pro: {
    messagesPerMonth: number
    tokensPerMonth: number
    maxFileSize: number
    maxFilesPerMessage: number
    features: string[]
  }
  team: {
    messagesPerMonth: number
    tokensPerMonth: number
    maxFileSize: number
    maxFilesPerMessage: number
    features: string[]
  }
  enterprise: {
    messagesPerMonth: number
    tokensPerMonth: number
    maxFileSize: number
    maxFilesPerMessage: number
    features: string[]
  }
}

export const SUBSCRIPTION_LIMITS: SubscriptionLimits = {
  free: {
    messagesPerMonth: 100,
    tokensPerMonth: 10000,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFilesPerMessage: 1,
    features: ['basic_chat', 'image_upload']
  },
  pro: {
    messagesPerMonth: 1000,
    tokensPerMonth: 100000,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFilesPerMessage: 3,
    features: ['basic_chat', 'image_upload', 'audio_upload', 'function_calling', 'personalities']
  },
  team: {
    messagesPerMonth: 5000,
    tokensPerMonth: 500000,
    maxFileSize: 25 * 1024 * 1024, // 25MB
    maxFilesPerMessage: 5,
    features: ['basic_chat', 'image_upload', 'audio_upload', 'function_calling', 'personalities', 'team_collaboration', 'priority_support']
  },
  enterprise: {
    messagesPerMonth: -1, // unlimited
    tokensPerMonth: -1, // unlimited
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxFilesPerMessage: 10,
    features: ['basic_chat', 'image_upload', 'audio_upload', 'function_calling', 'personalities', 'team_collaboration', 'priority_support', 'custom_integrations', 'dedicated_support']
  }
}

/**
 * Получить подписку пользователя
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    const response = await fetch(`/api/subscription?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null // Пользователь не найден
      }
      throw new Error('Ошибка получения подписки')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return null
  }
}

/**
 * Получить статистику использования
 */
export async function getUsageStats(userId: string): Promise<UsageStats | null> {
  try {
    const response = await fetch(`/api/usage?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Ошибка получения статистики')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return null
  }
}

/**
 * Проверить лимиты пользователя
 */
export function checkUserLimits(
  subscription: Subscription | null,
  usageStats: UsageStats | null
): {
  canSendMessage: boolean
  canUploadFile: boolean
  canUseFeature: (feature: string) => boolean
  remainingMessages: number
  remainingTokens: number
  limits: typeof SUBSCRIPTION_LIMITS.free
} {
  const tier = subscription?.tier || 'free'
  const limits = SUBSCRIPTION_LIMITS[tier]
  const usage = usageStats || { messagesUsed: 0, messagesLimit: 0, tokensUsed: 0, tokensLimit: 0, lastReset: new Date().toISOString() }

  const canSendMessage = limits.messagesPerMonth === -1 || usage.messagesUsed < limits.messagesPerMonth
  const canUploadFile = true // Базовая проверка, детали в API загрузки
  const canUseFeature = (feature: string) => limits.features.includes(feature)
  
  const remainingMessages = limits.messagesPerMonth === -1 ? -1 : Math.max(0, limits.messagesPerMonth - usage.messagesUsed)
  const remainingTokens = limits.tokensPerMonth === -1 ? -1 : Math.max(0, limits.tokensPerMonth - usage.tokensUsed)

  return {
    canSendMessage,
    canUploadFile,
    canUseFeature,
    remainingMessages,
    remainingTokens,
    limits
  }
}

/**
 * Создать checkout сессию Stripe
 */
export async function createCheckoutSession(
  priceId: string,
  userId: string,
  successUrl?: string,
  cancelUrl?: string
): Promise<{ url: string } | null> {
  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: successUrl || `${window.location.origin}/subscription?success=true`,
        cancelUrl: cancelUrl || `${window.location.origin}/subscription?canceled=true`
      })
    })

    if (!response.ok) {
      throw new Error('Ошибка создания checkout сессии')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return null
  }
}

/**
 * Создать portal сессию Stripe
 */
export async function createPortalSession(userId: string): Promise<{ url: string } | null> {
  try {
    const response = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    })

    if (!response.ok) {
      throw new Error('Ошибка создания portal сессии')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating portal session:', error)
    return null
  }
}

/**
 * Отменить подписку
 */
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/subscription/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subscriptionId })
    })

    return response.ok
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return false
  }
}

/**
 * Обновить подписку
 */
export async function updateSubscription(
  subscriptionId: string,
  updates: Partial<Subscription>
): Promise<boolean> {
  try {
    const response = await fetch('/api/subscription/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subscriptionId, updates })
    })

    return response.ok
  } catch (error) {
    console.error('Error updating subscription:', error)
    return false
  }
}

/**
 * Получить историю платежей
 */
export async function getPaymentHistory(userId: string): Promise<unknown[]> {
  try {
    const response = await fetch(`/api/payments?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Ошибка получения истории платежей')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return []
  }
}

/**
 * Проверить статус подписки
 */
export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false
  
  if (subscription.status === 'active') return true
  if (subscription.status === 'past_due' && subscription.currentPeriodEnd) {
    const endDate = new Date(subscription.currentPeriodEnd)
    return endDate > new Date() // Еще есть время на оплату
  }
  
  return false
}

/**
 * Получить дату истечения подписки
 */
export function getSubscriptionEndDate(subscription: Subscription | null): Date | null {
  if (!subscription?.currentPeriodEnd) return null
  return new Date(subscription.currentPeriodEnd)
}

/**
 * Проверить, истекает ли подписка скоро
 */
export function isSubscriptionExpiringSoon(subscription: Subscription | null, days: number = 7): boolean {
  const endDate = getSubscriptionEndDate(subscription)
  if (!endDate) return false
  
  const now = new Date()
  const diffTime = endDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= days && diffDays > 0
}
