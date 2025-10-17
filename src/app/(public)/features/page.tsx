import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Image, 
  Code, 
  Zap, 
  Shield, 
  Globe,
  MessageSquare,
  FileText,
  Palette,
  Search,
  Download,
  Settings
} from 'lucide-react'

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Brain,
      title: 'Мультимодальная нейросеть',
      description: 'Обрабатывает текст, изображения и код в единой архитектуре',
      details: [
        '30 миллиардов параметров',
        'Архитектура Transformer',
        'Оптимизация для русского языка',
        'Поддержка множества форматов'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Интеллектуальный чат',
      description: 'Естественное общение с ИИ в стиле ChatGPT',
      details: [
        'Контекстная память',
        'Streaming ответы',
        'История диалогов',
        'Персонализация'
      ]
    },
    {
      icon: Image,
      title: 'Анализ изображений',
      description: 'Понимание и описание визуального контента',
      details: [
        'Описание изображений',
        'Анализ объектов',
        'OCR (распознавание текста)',
        'Генерация по описанию'
      ]
    },
    {
      icon: Code,
      title: 'Генерация кода',
      description: 'Создание и анализ программного кода',
      details: [
        'Поддержка 20+ языков',
        'Отладка и оптимизация',
        'Документирование кода',
        'Code review'
      ]
    }
  ]

  const technicalFeatures = [
    {
      icon: Zap,
      title: 'Высокая производительность',
      description: 'Быстрые ответы и масштабируемость',
      metrics: ['200ms средняя задержка', '1000+ запросов/мин', '99.9% uptime']
    },
    {
      icon: Shield,
      title: 'Безопасность данных',
      description: 'Защита информации пользователей',
      metrics: ['Шифрование AES-256', 'TLS 1.3', 'GDPR соответствие']
    },
    {
      icon: Globe,
      title: 'Российская инфраструктура',
      description: 'Данные хранятся в России',
      metrics: ['Российские дата-центры', '152-ФЗ соответствие', 'Локальная поддержка']
    },
    {
      icon: Settings,
      title: 'Гибкая интеграция',
      description: 'API для любых приложений',
      metrics: ['REST API', 'WebSocket', 'SDK для популярных языков']
    }
  ]

  const useCases = [
    {
      category: 'Разработка',
      icon: Code,
      cases: [
        'Генерация кода по описанию',
        'Автоматическое документирование',
        'Code review и оптимизация',
        'Создание тестов'
      ]
    },
    {
      category: 'Контент',
      icon: FileText,
      cases: [
        'Написание статей и постов',
        'Создание презентаций',
        'Переводы и локализация',
        'SEO оптимизация'
      ]
    },
    {
      category: 'Дизайн',
      icon: Palette,
      cases: [
        'Анализ дизайна изображений',
        'Генерация описаний для UI',
        'Создание цветовых схем',
        'Оптимизация макетов'
      ]
    },
    {
      category: 'Аналитика',
      icon: Search,
      cases: [
        'Анализ больших данных',
        'Создание отчётов',
        'Поиск паттернов',
        'Прогнозирование трендов'
      ]
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
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Возможности <span className="text-primary">Radon AI</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Мощная мультимодальная нейросеть с 30 миллиардами параметров для решения любых задач
              </p>
              <div className="flex items-center justify-center gap-4 text-lg">
                <Badge className="bg-primary text-white px-4 py-2">
                  30B параметров
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  Мультимодальность
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  Российская разработка
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Основные возможности
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Полный набор инструментов для работы с искусственным интеллектом
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mainFeatures.map((feature) => (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Features */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Технические характеристики
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Высокая производительность и надёжность для production использования
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {technicalFeatures.map((feature) => (
                <Card key={feature.title} className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.metrics.map((metric) => (
                        <div key={metric} className="text-sm font-medium text-primary">
                          {metric}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Области применения
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Radon AI подходит для решения задач в различных сферах
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.cases.map((useCase) => (
                        <li key={useCase} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* API Features */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                API возможности
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Мощный API для интеграции в ваши приложения
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    REST API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>JSON API с полной документацией</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Поддержка всех основных языков программирования</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Rate limiting и мониторинг использования</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Webhook поддержка для уведомлений</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Streaming API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Server-Sent Events для real-time ответов</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>WebSocket поддержка для интерактивных чатов</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Контроль потока и буферизация</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Автоматическое переподключение</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Готовы попробовать?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Начните использовать Radon AI уже сегодня
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                <Brain className="w-5 h-5 mr-2" />
                Начать бесплатно
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Code className="w-5 h-5 mr-2" />
                Посмотреть API
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
