"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Crown, 
  Zap, 
  Building2, 
  Check, 
  X, 
  Calendar,
  CreditCard,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { subscriptionApi, SubscriptionResponse, UsageStatsResponse } from '@/lib/subscription-api'

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      const [subscriptionResponse, usageResponse] = await Promise.all([
        subscriptionApi.getCurrentSubscription(),
        subscriptionApi.getUsageStats('30d')
      ])
      
      setSubscription(subscriptionResponse.data)
      setUsageStats(usageResponse.data)
    } catch (error) {
      console.error('Error loading subscription data:', error)
      toast.error('Ошибка загрузки данных подписки')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: string) => {
    if (planId === 'pro' || planId === 'team') {
      try {
        setUpgrading(true)
        const response = await subscriptionApi.createCheckoutSession(planId)
        window.location.href = response.data.checkoutUrl
      } catch (error) {
        console.error('Error creating checkout session:', error)
        toast.error('Ошибка создания сессии оплаты')
      } finally {
        setUpgrading(false)
      }
    } else if (planId === 'enterprise') {
      toast.info('Свяжитесь с нами для Enterprise плана')
    }
  }

  const handleManageSubscription = async () => {
    try {
      const response = await subscriptionApi.createPortalSession()
      window.location.href = response.data.portalUrl
    } catch (error) {
      console.error('Error creating portal session:', error)
      toast.error('Ошибка открытия портала управления')
    }
  }

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'навсегда',
      icon: Zap,
      badge: null,
      features: [
        '10 запросов в день',
        'Текстовая генерация',
        'Анализ изображений',
        'Базовая поддержка',
        'История чатов (7 дней)'
      ],
      limitations: [
        'Ограниченная скорость',
        'Нет приоритетной поддержки',
        'Нет API доступа'
      ],
      cta: 'Текущий план',
      href: null,
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19,
      period: 'месяц',
      icon: Crown,
      badge: 'Популярный',
      features: [
        'Безлимитные запросы',
        'Приоритетная обработка',
        'Расширенная история',
        'API доступ',
        'Приоритетная поддержка',
        'Экспорт чатов'
      ],
      limitations: [],
      cta: 'Обновить до Pro',
      href: '/upgrade/pro',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Кастом',
      period: 'месяц',
      icon: Building2,
      badge: null,
      features: [
        'Всё из Pro',
        'Кастомные лимиты',
        'Dedicated поддержка',
        'SLA гарантии',
        'Интеграции',
        'Обучение команды'
      ],
      limitations: [],
      cta: 'Связаться с нами',
      href: '/contact',
      popular: false
    }
  ]


  const getUsagePercentage = () => {
    if (!usageStats) return 0
    const dailyUsage = usageStats.dailyBreakdown[usageStats.dailyBreakdown.length - 1]?.requests || 0
    const limit = subscription?.tier === 'free' ? 10 : -1
    if (limit === -1) return 0
    return (dailyUsage / limit) * 100
  }

  const getUsageColor = () => {
    const percentage = getUsagePercentage()
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Crown className="w-8 h-8" />
            Управление подпиской
          </h1>
          <p className="text-muted-foreground mt-2">
            Управляйте своей подпиской и тарифным планом
          </p>
        </div>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Текущий план
            </CardTitle>
            <CardDescription>
              Ваша текущая подписка и использование
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {subscription?.tier === 'free' ? 'Free Plan' : 
                       subscription?.tier === 'pro' ? 'Pro Plan' :
                       subscription?.tier === 'team' ? 'Team Plan' : 'Enterprise Plan'}
                    </h3>
                    <p className="text-muted-foreground">
                      {subscription?.tier === 'free' ? '$0 навсегда' :
                       subscription?.tier === 'pro' ? '$19/месяц' :
                       subscription?.tier === 'team' ? '$99/месяц' : 'Custom pricing'}
                    </p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {subscription?.tier === 'free' ? <Zap className="w-3 h-3" /> :
                     subscription?.tier === 'pro' ? <Crown className="w-3 h-3" /> :
                     subscription?.tier === 'team' ? <Building2 className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
                    {subscription?.status === 'active' ? 'Активен' : subscription?.status}
                  </Badge>
                </div>
            
            <Separator />
            
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Использование сегодня</span>
                    <span className="text-sm text-muted-foreground">
                      {usageStats?.dailyBreakdown[usageStats.dailyBreakdown.length - 1]?.requests || 0} из {subscription?.tier === 'free' ? '10' : '∞'}
                    </span>
                  </div>
                  {subscription?.tier === 'free' && (
                    <>
                      <Progress 
                        value={getUsagePercentage()} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Сброс: {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')}
                      </p>
                    </>
                  )}
                </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Статистика использования
            </CardTitle>
            <CardDescription>
              Ваша активность за последний месяц
            </CardDescription>
          </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{usageStats?.totalRequests || 0}</div>
                    <div className="text-sm text-muted-foreground">Запросов в месяц</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{usageStats?.totalMessages || 0}</div>
                    <div className="text-sm text-muted-foreground">Сообщений отправлено</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{usageStats?.totalApiCalls || 0}</div>
                    <div className="text-sm text-muted-foreground">API вызовов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {subscription?.currentPeriodEnd ? 
                        new Date(subscription.currentPeriodEnd).toLocaleDateString('ru-RU') : 
                        'N/A'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Следующий платеж</div>
                  </div>
                </div>
              </CardContent>
        </Card>
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Доступные планы</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border hover:border-primary/50'
              } transition-all duration-300`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>
                  {plan.price === 'Кастом' ? (
                    'Индивидуальные условия'
                  ) : (
                    `$${plan.price}/${plan.period}`
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{limitation}</span>
                    </div>
                  ))}
                </div>
                
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={plan.id === subscription?.tier || upgrading}
                    >
                      {plan.id === subscription?.tier ? (
                        'Текущий план'
                      ) : upgrading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Обработка...
                        </>
                      ) : (
                        <>
                          {plan.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Управление подпиской
              </CardTitle>
              <CardDescription>
                Управляйте своей подпиской и просматривайте историю платежей
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscription?.tier === 'free' ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Нет активной подписки</h3>
                  <p className="text-muted-foreground mb-4">
                    Обновите план, чтобы получить доступ к управлению подпиской.
                  </p>
                  <Button onClick={() => handleUpgrade('pro')}>
                    Обновить до Pro
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Управление подпиской</h4>
                      <p className="text-sm text-muted-foreground">
                        Измените план, обновите способ оплаты или отмените подписку
                      </p>
                    </div>
                    <Button onClick={handleManageSubscription}>
                      Управлять
                    </Button>
                  </div>
                  
                  <div className="text-center py-4">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      История платежей доступна в портале управления
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
    </div>
  )
}
