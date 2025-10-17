import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  X, 
  Zap, 
  Crown, 
  Building,
  CreditCard,
  Clock,
  Users,
  MessageSquare,
  Code,
  Shield,
  Star
} from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'навсегда',
      description: 'Для тестирования и небольших проектов',
      icon: Zap,
      color: 'border-gray-300',
      popular: false,
      features: [
        { name: '10 запросов в день', included: true },
        { name: 'Базовая поддержка', included: true },
        { name: 'История чатов (7 дней)', included: true },
        { name: 'API доступ', included: true },
        { name: 'Приоритетная поддержка', included: false },
        { name: 'Расширенная история', included: false },
        { name: 'Высокие лимиты', included: false },
        { name: 'Персональный менеджер', included: false }
      ],
      cta: 'Начать бесплатно',
      ctaVariant: 'outline' as const
    },
    {
      name: 'Pro',
      price: '2990',
      period: 'в месяц',
      description: 'Для профессионального использования',
      icon: Crown,
      color: 'border-primary',
      popular: true,
      features: [
        { name: '1000 запросов в день', included: true },
        { name: 'Приоритетная поддержка', included: true },
        { name: 'История чатов (1 год)', included: true },
        { name: 'API доступ', included: true },
        { name: 'Расширенные возможности', included: true },
        { name: 'Приоритетная обработка', included: true },
        { name: 'Экспорт данных', included: true },
        { name: 'Персональный менеджер', included: false }
      ],
      cta: 'Выбрать Pro',
      ctaVariant: 'default' as const
    },
    {
      name: 'Enterprise',
      price: 'По запросу',
      period: '',
      description: 'Для крупных организаций',
      icon: Building,
      color: 'border-purple-500',
      popular: false,
      features: [
        { name: 'Безлимитные запросы', included: true },
        { name: 'Персональный менеджер', included: true },
        { name: 'Безлимитная история', included: true },
        { name: 'Приоритетный API', included: true },
        { name: 'Dedicated инфраструктура', included: true },
        { name: 'SLA 99.9%', included: true },
        { name: 'Кастомная интеграция', included: true },
        { name: 'Обучение команды', included: true }
      ],
      cta: 'Связаться с нами',
      ctaVariant: 'outline' as const
    }
  ]

  const faq = [
    {
      question: 'Можно ли изменить тариф в любое время?',
      answer: 'Да, вы можете изменить тариф в любое время в настройках аккаунта. При переходе на более дорогой план вы платите пропорционально.'
    },
    {
      question: 'Что происходит при превышении лимитов?',
      answer: 'При превышении дневных лимитов Free тарифа доступ к API временно ограничивается до следующего дня. Pro пользователи получают уведомления о приближении к лимиту.'
    },
    {
      question: 'Есть ли скидки для студентов?',
      answer: 'Да! Студенты могут получить скидку 50% на Pro тариф. Для этого отправьте документ, подтверждающий статус студента, на support@radonai.com.'
    },
    {
      question: 'Можно ли отменить подписку?',
      answer: 'Да, вы можете отменить подписку в любое время в настройках аккаунта. После отмены вы сохраните доступ до конца оплаченного периода.'
    },
    {
      question: 'Какие способы оплаты принимаются?',
      answer: 'Мы принимаем банковские карты, PayPal, банковские переводы и корпоративные счета. Для Enterprise клиентов доступны индивидуальные условия оплаты.'
    },
    {
      question: 'Есть ли пробный период для Pro?',
      answer: 'Да, мы предоставляем 14-дневный бесплатный пробный период для Pro тарифа. Никаких обязательств по оплате до окончания пробного периода.'
    }
  ]

  const features = [
    {
      icon: MessageSquare,
      title: 'Неограниченные чаты',
      description: 'Общайтесь с ИИ столько, сколько нужно'
    },
    {
      icon: Code,
      title: 'API доступ',
      description: 'Интегрируйте Radon AI в ваши приложения'
    },
    {
      icon: Shield,
      title: 'Безопасность данных',
      description: 'Все данные защищены и хранятся в России'
    },
    {
      icon: Clock,
      title: 'Быстрые ответы',
      description: 'Средняя задержка ответа менее 200ms'
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Тарифные <span className="text-primary">планы</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Выберите план, который подходит именно вам. Начните бесплатно или сразу переходите на Pro
              </p>
              <div className="flex items-center justify-center gap-4 text-lg">
                <Badge className="bg-green-500 text-white px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  14 дней бесплатно
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  Отмена в любое время
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`relative ${plan.color} ${plan.popular ? 'border-2 shadow-lg scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-white px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Популярный
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        {plan.price === 'По запросу' ? plan.price : `${plan.price} ₽`}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground ml-2">/{plan.period}</span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature.name} className="flex items-center gap-3">
                          {feature.included ? (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full" 
                      variant={plan.ctaVariant}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Что включено во все планы
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Базовые возможности доступны всем пользователям
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Частые вопросы
              </h2>
              <p className="text-xl text-muted-foreground">
                Ответы на популярные вопросы о тарифах
              </p>
            </div>

            <div className="space-y-6">
              {faq.map((item) => (
                <Card key={item.question}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Нужен корпоративный план?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Свяжитесь с нами для обсуждения индивидуальных условий
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                <Building className="w-5 h-5 mr-2" />
                Связаться с нами
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Users className="w-5 h-5 mr-2" />
                Запросить демо
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
