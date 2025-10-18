import { nextApiClient } from './api-client'

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
    nextApiClient.get<SubscriptionResponse>('/api/subscription'),
  
  createCheckoutSession: (tier: string) =>
    nextApiClient.post<CheckoutSessionResponse>('/api/subscription/checkout', { tier }),
  
  createPortalSession: () =>
    nextApiClient.post<PortalSessionResponse>('/api/subscription/portal'),
  
  getUsageStats: (period: string = '30d') =>
    nextApiClient.get<UsageStatsResponse>(`/api/usage?period=${period}`)
}

export default subscriptionApi
