"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Zap, Crown, Building2 } from 'lucide-react'

const plans = [
  {
    name: "Free",
    price: "0",
    period: "навсегда",
    description: "Бесплатный старт для знакомства с возможностями Radon AI",
    icon: Zap,
    badge: null,
    features: [
      "До 25 запросов в день",
      "Текстовая генерация и анализ",
      "Базовая обработка изображений",
      "Стандартная очередь запросов",
      "История чатов (7 дней)"
    ],
    limitations: [
      "Без API-доступа",
      "Без приоритетной поддержки",
      "Скорость отклика ограничена"
    ],
    cta: "Попробовать бесплатно",
    href: "/sign-up",
    popular: false
  },
  {
    name: "Pro",
    price: "39",
    period: "в месяц",
    description: "Оптимальный выбор для активных пользователей и разработчиков",
    icon: Star,
    badge: "Популярный",
    features: [
      "Безлимитные запросы",
      "Полная мультимодальная поддержка (текст + изображение + код)",
      "Приоритетная обработка",
      "История чатов (90 дней)",
      "Экспорт диалогов и результатов",
      "Доступ к Radon API (50K req/день)",
      "Поддержка через Telegram/Email"
    ],
    limitations: [
      "Без командных функций",
      "API ограничен скоростью 2 req/сек"
    ],
    cta: "Активировать Pro",
    href: "/sign-up?plan=pro",
    popular: true
  },
  {
    name: "Team",
    price: "149",
    period: "в месяц",
    description: "Командная работа с централизованным управлением и аналитикой",
    icon: Building2,
    badge: "Для бизнеса",
    features: [
      "Все возможности Pro",
      "Общий workspace для до 15 участников",
      "Ролевое управление и права доступа",
      "Централизованная оплата",
      "Team analytics dashboard",
      "Radon API (250K req/день)",
      "Интеграция с Slack, Notion, GitHub",
      "Приоритетная поддержка 24/7"
    ],
    limitations: [],
    cta: "Подключить Team",
    href: "/sign-up?plan=team",
    popular: false
  },
  {
    name: "Enterprise",
    price: "Кастом",
    period: "по запросу",
    description: "Полный контроль, кастомизация и безопасность корпоративного уровня",
    icon: Crown,
    badge: "Корпоративный",
    features: [
      "Все возможности Team",
      "Неограниченные API-запросы",
      "Dedicated модель и серверные кластеры",
      "SLA 99.99% и персональный менеджер",
      "On-premise развертывание",
      "Интеграции под NDA",
      "Адаптированное обучение модели под данные клиента",
      "Обучение и консалтинг команды"
    ],
    limitations: [],
    cta: "Связаться с отделом продаж",
    href: "/contact",
    popular: false
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Простые и прозрачные <span className="text-primary">тарифы</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Выберите уровень доступа к Radon AI — от старта до корпоративного масштаба.
            Можно обновить план в любое время.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className={`px-4 py-1 ${plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <Card className={`h-full relative overflow-hidden bg-card/80 backdrop-blur-md ${
                plan.popular ? 'border-primary shadow-xl scale-105' : 'border-border'
              } transition-all duration-300`}>
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                
                <CardHeader className="text-center pb-8 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {plan.price === "Кастом" ? "По запросу" : `$${plan.price}`}
                    </span>
                    {plan.price !== "Кастом" && (
                      <span className="text-muted-foreground ml-2">/{plan.period}</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 relative z-10">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Ограничения:</p>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="text-xs text-muted-foreground">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="relative z-10">
                  <Button 
                    onClick={() => window.location.href = plan.href}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-white text-black hover:bg-gray-100 border-0' 
                        : 'bg-gray-900 text-white hover:bg-gray-800 border-0'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Все платные тарифы включают 14-дневную гарантию возврата средств.
          </p>
          <p className="text-sm text-muted-foreground">
            Не уверены, какой тариф выбрать?{" "}
            <button 
              onClick={() => window.location.href = '/contact'} 
              className="text-primary hover:underline cursor-pointer"
            >
              Свяжитесь с нами
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
