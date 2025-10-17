"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Zap, Crown } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: "Free",
    price: "0",
    period: "навсегда",
    description: "Идеально для знакомства с Radon AI",
    icon: Zap,
    badge: null,
    features: [
      "10 запросов в день",
      "Текстовая генерация",
      "Анализ изображений",
      "Базовая поддержка",
      "История чатов (7 дней)"
    ],
    limitations: [
      "Ограниченная скорость",
      "Нет приоритетной поддержки"
    ],
    cta: "Начать бесплатно",
    href: "/sign-up",
    popular: false
  },
  {
    name: "Pro",
    price: "19",
    period: "в месяц",
    description: "Для профессионалов и команд",
    icon: Star,
    badge: "Популярный",
    features: [
      "Безлимитные запросы",
      "Все типы генерации",
      "Приоритетная обработка",
      "Расширенная история",
      "Экспорт чатов",
      "Приоритетная поддержка",
      "API доступ"
    ],
    limitations: [],
    cta: "Начать Pro",
    href: "/sign-up?plan=pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Кастом",
    period: "по запросу",
    description: "Для крупных организаций",
    icon: Crown,
    badge: "Корпоративный",
    features: [
      "Все возможности Pro",
      "Кастомные лимиты",
      "Dedicated API",
      "Персональный менеджер",
      "SLA 99.9%",
      "On-premise развертывание",
      "Кастомная интеграция",
      "Обучение команды"
    ],
    limitations: [],
    cta: "Связаться с нами",
    href: "/contact",
    popular: false
  }
]

export function Pricing() {
  return (
    <section className="py-24">
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
            Выберите план, который подходит именно вам. Всегда можно изменить тариф или отменить подписку
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <Card className={`h-full relative overflow-hidden ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border hover:border-primary/50'
              } transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                )}
                
                <CardHeader className="text-center pb-8">
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
                
                <CardContent className="space-y-6">
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
                
                <CardFooter>
                  <Button 
                    asChild 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    size="lg"
                  >
                    <Link href={plan.href}>
                      {plan.cta}
                    </Link>
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
            Все планы включают 14-дневную гарантию возврата денег
          </p>
          <p className="text-sm text-muted-foreground">
            Нужна помощь с выбором? <Link href="/contact" className="text-primary hover:underline">Свяжитесь с нами</Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
