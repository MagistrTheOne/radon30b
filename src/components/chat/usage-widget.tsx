"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Crown, 
  Zap, 
  TrendingUp, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react'
import { subscriptionApi } from '@/lib/subscription-api'

interface UsageStats {
  used: number
  limit: number
  period: string
}

interface UsageWidgetProps {
  subscription: 'free' | 'pro' | 'enterprise'
}

export function UsageWidget({ subscription }: UsageWidgetProps) {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUsageStats = async () => {
      try {
        const response = await fetch('/api/usage/stats')
        if (response.ok) {
          const data = await response.json()
          setUsageStats({
            used: data.used,
            limit: data.limit,
            period: data.period
          })
        } else {
          // Fallback to mock data if API fails
          const mockStats: UsageStats = {
            used: subscription === 'free' ? 7 : subscription === 'pro' ? 45 : 120,
            limit: subscription === 'free' ? 10 : subscription === 'pro' ? 100 : 1000,
            period: 'сегодня'
          }
          setUsageStats(mockStats)
        }
      } catch (error) {
        console.error('Error loading usage stats:', error)
        // Fallback to mock data
        const mockStats: UsageStats = {
          used: subscription === 'free' ? 7 : subscription === 'pro' ? 45 : 120,
          limit: subscription === 'free' ? 10 : subscription === 'pro' ? 100 : 1000,
          period: 'сегодня'
        }
        setUsageStats(mockStats)
      } finally {
        setLoading(false)
      }
    }

    loadUsageStats()
  }, [subscription])

  const getSubscriptionBadge = () => {
    switch (subscription) {
      case 'pro':
        return (
          <Badge className="bg-primary text-primary-foreground">
            <Crown className="w-3 h-3 mr-1" />
            Pro
          </Badge>
        )
      case 'enterprise':
        return (
          <Badge className="bg-purple-500 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Enterprise
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <Zap className="w-3 h-3 mr-1" />
            Free
          </Badge>
        )
    }
  }

  const getUsagePercentage = () => {
    if (!usageStats) return 0
    return Math.min((usageStats.used / usageStats.limit) * 100, 100)
  }

  const getUsageColor = () => {
    const percentage = getUsagePercentage()
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-primary'
  }

  const getMotivationalMessage = () => {
    const percentage = getUsagePercentage()
    
    if (subscription === 'free') {
      if (percentage >= 90) {
        return "Почти достигли лимита! Обновитесь для большего."
      } else if (percentage >= 70) {
        return "Хороший прогресс! Еще немного до лимита."
      } else {
        return "Я сильнее, когда ты мне доверяешь."
      }
    } else if (subscription === 'pro') {
      return "Pro-мощь в действии! Продолжайте творить."
    } else {
      return "Enterprise-уровень! Безграничные возможности."
    }
  }

  if (loading) {
    return (
      <Card className="p-4 bg-sidebar/50 backdrop-blur-sm border-sidebar-border">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded mb-2"></div>
          <div className="h-2 bg-muted rounded mb-2"></div>
          <div className="h-3 bg-muted rounded"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 bg-sidebar/50 backdrop-blur-sm border-sidebar-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-sidebar-foreground">
          Control Center
        </span>
        {getSubscriptionBadge()}
      </div>

      {/* Usage Progress */}
      {usageStats && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Использовано {usageStats.used} из {usageStats.limit}</span>
            <span>{usageStats.period}</span>
          </div>
          <Progress 
            value={getUsagePercentage()} 
            className="h-2 mb-2"
          />
          <div className="text-xs text-muted-foreground">
            {Math.round(getUsagePercentage())}% от лимита
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground italic">
            {getMotivationalMessage()}
          </p>
        </div>
      </div>

      {/* Upgrade Button (only for Free/Pro) */}
      {subscription !== 'enterprise' && (
        <Button 
          size="sm" 
          className="w-full text-xs"
          variant={subscription === 'free' ? 'default' : 'outline'}
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          {subscription === 'free' ? 'Обновить до Pro' : 'Обновить до Enterprise'}
          <ArrowUpRight className="w-3 h-3 ml-1" />
        </Button>
      )}

      {/* Enterprise Stats */}
      {subscription === 'enterprise' && (
        <div className="text-center">
          <div className="text-xs text-muted-foreground">
            Безлимитный доступ
          </div>
          <div className="text-xs text-primary font-medium">
            Enterprise
          </div>
        </div>
      )}
    </Card>
  )
}
