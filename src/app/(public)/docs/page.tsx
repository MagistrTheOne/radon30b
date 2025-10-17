import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  Search, 
  Code, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  FileText,
  Play,
  Download,
  ExternalLink,
  Clock,
  Image,
  MessageSquare
} from 'lucide-react'

export default function DocsPage() {
  const quickStart = [
    {
      title: 'Быстрый старт',
      description: 'Начните работу с Radon AI за 5 минут',
      icon: Zap,
      time: '5 мин',
      steps: ['Регистрация', 'Получение API ключа', 'Первый запрос']
    },
    {
      title: 'API Reference',
      description: 'Полная документация по API',
      icon: Code,
      time: '15 мин',
      steps: ['Аутентификация', 'Endpoints', 'Примеры кода']
    },
    {
      title: 'SDK и библиотеки',
      description: 'Готовые SDK для популярных языков',
      icon: BookOpen,
      time: '10 мин',
      steps: ['Установка', 'Настройка', 'Использование']
    }
  ]

  const guides = [
    {
      title: 'Интеграция с Python',
      description: 'Пошаговое руководство по интеграции Radon AI в Python приложения',
      category: 'Интеграция',
      time: '20 мин',
      difficulty: 'Начинающий'
    },
    {
      title: 'Создание чат-бота',
      description: 'Создание Telegram бота с использованием Radon AI API',
      category: 'Проекты',
      time: '30 мин',
      difficulty: 'Средний'
    },
    {
      title: 'Анализ изображений',
      description: 'Работа с мультимодальными возможностями для анализа изображений',
      category: 'Возможности',
      time: '15 мин',
      difficulty: 'Начинающий'
    },
    {
      title: 'Streaming ответы',
      description: 'Реализация real-time ответов в веб-приложениях',
      category: 'Продвинутое',
      time: '25 мин',
      difficulty: 'Продвинутый'
    },
    {
      title: 'Безопасность API',
      description: 'Лучшие практики по обеспечению безопасности при работе с API',
      category: 'Безопасность',
      time: '18 мин',
      difficulty: 'Средний'
    },
    {
      title: 'Масштабирование',
      description: 'Оптимизация производительности для высоконагруженных приложений',
      category: 'Продвинутое',
      time: '35 мин',
      difficulty: 'Продвинутый'
    }
  ]

  const sdkLanguages = [
    { name: 'Python', version: '1.2.0', status: 'stable' },
    { name: 'JavaScript', version: '1.1.5', status: 'stable' },
    { name: 'TypeScript', version: '1.1.5', status: 'stable' },
    { name: 'Go', version: '0.9.2', status: 'beta' },
    { name: 'PHP', version: '0.8.1', status: 'beta' },
    { name: 'Java', version: '0.7.3', status: 'alpha' }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Начинающий': return 'bg-green-500'
      case 'Средний': return 'bg-yellow-500'
      case 'Продвинутый': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Документация <span className="text-primary">Radon AI</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Полные руководства, API документация и примеры кода для интеграции с Radon AI
              </p>
              
              {/* Search */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Поиск по документации..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Быстрый старт
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Начните работу с Radon AI за несколько минут
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {quickStart.map((item) => (
                <Card key={item.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{item.time}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {item.steps.map((step, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                            {index + 1}
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full">
                      Начать
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Guides */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Руководства
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Подробные руководства для различных сценариев использования
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <Card key={guide.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{guide.category}</Badge>
                      <Badge className={`${getDifficultyColor(guide.difficulty)} text-white text-xs`}>
                        {guide.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{guide.time}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Читать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SDK */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                SDK и библиотеки
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Официальные SDK для популярных языков программирования
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sdkLanguages.map((sdk) => (
                <Card key={sdk.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{sdk.name}</CardTitle>
                      <Badge 
                        variant={sdk.status === 'stable' ? 'default' : 'secondary'}
                        className={sdk.status === 'stable' ? 'bg-green-500' : ''}
                      >
                        {sdk.status}
                      </Badge>
                    </div>
                    <CardDescription>Версия {sdk.version}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Установить
                      </Button>
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Документация
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                API Reference
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Полная документация по всем endpoints и параметрам
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Аутентификация
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Настройка API ключей и безопасность
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Подробнее
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Chat API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Генерация текста и диалоги
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Подробнее
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Vision API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Анализ изображений
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Подробнее
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Streaming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Real-time ответы
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Нужна помощь?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Наша команда поддержки готова помочь с интеграцией
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                <MessageSquare className="w-5 h-5 mr-2" />
                Связаться с поддержкой
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <FileText className="w-5 h-5 mr-2" />
                Сообщество
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
