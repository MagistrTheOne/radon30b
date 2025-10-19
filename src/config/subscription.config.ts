export interface SubscriptionLimits {
  messagesPerMonth: number
  tokensPerMonth: number
  maxFileSize: number
  maxFilesPerMessage: number
  features: string[]
}

export interface SubscriptionConfig {
  limits: {
    free: SubscriptionLimits
    pro: SubscriptionLimits
    team: SubscriptionLimits
    enterprise: SubscriptionLimits
  }
  prices: {
    pro: { monthly: number; yearly: number }
    team: { monthly: number; yearly: number }
    enterprise: { custom: boolean }
  }
}

export const SUBSCRIPTION_CONFIG: SubscriptionConfig = {
  limits: {
    free: {
      messagesPerMonth: 100,
      tokensPerMonth: 50000, // Увеличено под новые лимиты Radon
      maxFileSize: 5 * 1024 * 1024, // 5MB
      maxFilesPerMessage: 1,
      features: ['basic_chat', 'image_upload']
    },
    pro: {
      messagesPerMonth: 1000,
      tokensPerMonth: 500000, // Увеличено под новые лимиты Radon
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFilesPerMessage: 3,
      features: ['basic_chat', 'image_upload', 'audio_upload', 'function_calling', 'personalities']
    },
    team: {
      messagesPerMonth: 5000,
      tokensPerMonth: 2000000, // Увеличено под новые лимиты Radon
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
  },
  prices: {
    pro: { monthly: 990, yearly: 9900 },
    team: { monthly: 2990, yearly: 29900 },
    enterprise: { custom: true }
  }
}
