import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react'

export default function StatusPage() {
  const services = [
    {
      name: 'API',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '120ms',
      lastIncident: '2 дня назад'
    },
    {
      name: 'Chat Interface',
      status: 'operational',
      uptime: '99.8%',
      responseTime: '85ms',
      lastIncident: '1 неделя назад'
    },
    {
      name: 'Authentication',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '45ms',
      lastIncident: '3 дня назад'
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '12ms',
      lastIncident: '5 дней назад'
    },
    {
      name: 'File Storage',
      status: 'degraded',
      uptime: '98.5%',
      responseTime: '250ms',
      lastIncident: 'Сейчас'
    },
    {
      name: 'AI Model',
      status: 'operational',
      uptime: '99.7%',
      responseTime: '800ms',
      lastIncident: '1 день назад'
    }
  ]

  const incidents = [
    {
      id: 'INC-2025-001',
      title: 'Повышенная задержка файлового хранилища',
      status: 'investigating',
      impact: 'minor',
      started: '2025-10-17T10:30:00Z',
      description: 'Обнаружена повышенная задержка при загрузке изображений. Работаем над решением.'
    },
    {
      id: 'INC-2025-002',
      title: 'Временная недоступность API',
      status: 'resolved',
      impact: 'major',
      started: '2025-10-17T14:20:00Z',
      resolved: '2025-10-17T15:45:00Z',
      description: 'API был недоступен в течение 1 часа 25 минут из-за проблем с балансировщиком нагрузки.'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'investigating':
        return <Clock className="w-5 h-5 text-blue-500" />
      default:
        return <Activity className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500 text-white">Работает</Badge>
      case 'degraded':
        return <Badge className="bg-yellow-500 text-white">Проблемы</Badge>
      case 'outage':
        return <Badge className="bg-red-500 text-white">Недоступен</Badge>
      case 'investigating':
        return <Badge className="bg-blue-500 text-white">Расследование</Badge>
      case 'resolved':
        return <Badge className="bg-gray-500 text-white">Решено</Badge>
      default:
        return <Badge variant="secondary">Неизвестно</Badge>
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'minor':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Незначительное</Badge>
      case 'major':
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Значительное</Badge>
      case 'critical':
        return <Badge variant="outline" className="border-red-500 text-red-500">Критическое</Badge>
      default:
        return <Badge variant="outline">Неизвестно</Badge>
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
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Статус <span className="text-primary">системы</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Мониторинг состояния всех сервисов Radon AI в реальном времени
              </p>
              <div className="flex items-center justify-center gap-2 text-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="font-semibold">Все системы работают</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Status */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Статус сервисов
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Текущее состояние всех компонентов платформы
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(service.status)}
                        {service.name}
                      </CardTitle>
                      {getStatusBadge(service.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Uptime:</span>
                        <span className="font-medium">{service.uptime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Время отклика:</span>
                        <span className="font-medium">{service.responseTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Последний инцидент:</span>
                        <span className="font-medium">{service.lastIncident}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Последние инциденты
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                История проблем и их решений
              </p>
            </div>

            <div className="space-y-6">
              {incidents.map((incident) => (
                <Card key={incident.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">{incident.title}</CardTitle>
                          {getStatusBadge(incident.status)}
                          {getImpactBadge(incident.impact)}
                        </div>
                        <CardDescription className="text-sm">
                          ID: {incident.id} • Начало: {new Date(incident.started).toLocaleString('ru-RU')}
                          {incident.resolved && (
                            <span> • Решено: {new Date(incident.resolved).toLocaleString('ru-RU')}</span>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{incident.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* System Metrics */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Метрики системы
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Ключевые показатели производительности за последние 30 дней
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-green-500">99.9%</CardTitle>
                  <CardDescription>Общий uptime</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-blue-500">156ms</CardTitle>
                  <CardDescription>Среднее время отклика</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-purple-500">2.4M</CardTitle>
                  <CardDescription>Запросов за месяц</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-orange-500">0.1%</CardTitle>
                  <CardDescription>Ошибок за месяц</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Subscribe to Updates */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Подписка на обновления
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Получайте уведомления о статусе системы и инцидентах
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Подписаться
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
