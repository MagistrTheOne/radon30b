import { apiClient } from './api-client'

export interface SubscriptionResponse {
  id: string
  userId: string
  tier: string
  status: string
  currentPeriodEnd?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  createdAt: string
  updatedAt: string
}

export interface UsageStatsResponse {
  period: string
  totalRequests: number
  totalMessages: number
  totalApiCalls: number
  dailyBreakdown: Array<{
    date: string
    requests: number
  }>
}

export interface CheckoutSessionRequest {
  tier: string
}

export interface CheckoutSessionResponse {
  checkoutUrl: string
}

export interface PortalSessionResponse {
  portalUrl: string
}

export const subscriptionApi = {
  getCurrentSubscription: () => 
    apiClient.get<SubscriptionResponse>('/api/subscription'),
  
  createCheckoutSession: (tier: string) =>
    apiClient.post<CheckoutSessionResponse>('/api/subscription/checkout', { tier }),
  
  createPortalSession: () =>
    apiClient.post<PortalSessionResponse>('/api/subscription/portal'),
  
  getUsageStats: (period: string = '30d') =>
    apiClient.get<UsageStatsResponse>(`/api/subscription/usage?period=${period}`)
}

export default subscriptionApi
