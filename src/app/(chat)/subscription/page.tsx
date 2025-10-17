"use client"

import { useState } from 'react'
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
  ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'

export default function SubscriptionPage() {
  const [currentPlan] = useState('free')
  const [usage] = useState({
    requests: 3,
    limit: 10,
    resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
  })

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

  const handleUpgrade = (planId: string) => {
    if (planId === 'pro') {
      toast.info('Переход на Pro план будет реализован в будущем')
    } else if (planId === 'enterprise') {
      toast.info('Свяжитесь с нами для Enterprise плана')
    }
  }

  const getUsagePercentage = () => {
    return (usage.requests / usage.limit) * 100
  }

  const getUsageColor = () => {
    const percentage = getUsagePercentage()
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
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
                <h3 className="text-xl font-semibold">Free Plan</h3>
                <p className="text-muted-foreground">$0 навсегда</p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Активен
              </Badge>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Использование сегодня</span>
                <span className="text-sm text-muted-foreground">
                  {usage.requests} из {usage.limit}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage()} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Сброс: {usage.resetDate.toLocaleDateString('ru-RU')}
              </p>
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
                <div className="text-2xl font-bold">47</div>
                <div className="text-sm text-muted-foreground">Запросов в месяц</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Чатов создано</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">2.3k</div>
                <div className="text-sm text-muted-foreground">Слов сгенерировано</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">Изображений обработано</div>
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
                  disabled={plan.id === currentPlan}
                >
                  {plan.id === currentPlan ? (
                    'Текущий план'
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
            История платежей
          </CardTitle>
          <CardDescription>
            Ваши предыдущие платежи и транзакции
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Нет платежей</h3>
            <p className="text-muted-foreground">
              У вас пока нет истории платежей. Обновите план, чтобы увидеть транзакции.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
