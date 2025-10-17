import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Cookie, Settings, Shield, BarChart3, User } from 'lucide-react'

export default function CookiesPage() {
  const cookieTypes = [
    {
      name: 'Необходимые cookies',
      description: 'Обеспечивают базовую функциональность сайта',
      icon: Shield,
      required: true,
      examples: ['Аутентификация', 'Безопасность', 'Настройки пользователя'],
      purpose: 'Эти cookies необходимы для работы сайта и не могут быть отключены'
    },
    {
      name: 'Функциональные cookies',
      description: 'Улучшают пользовательский опыт',
      icon: Settings,
      required: false,
      examples: ['Запоминание настроек', 'Языковые предпочтения', 'Тема оформления'],
      purpose: 'Позволяют сайту запоминать ваши предпочтения'
    },
    {
      name: 'Аналитические cookies',
      description: 'Помогают понять, как используется сайт',
      icon: BarChart3,
      required: false,
      examples: ['Google Analytics', 'Метрики использования', 'A/B тестирование'],
      purpose: 'Собирают анонимную статистику для улучшения сервиса'
    },
    {
      name: 'Рекламные cookies',
      description: 'Используются для показа релевантной рекламы',
      icon: Cookie,
      required: false,
      examples: ['Таргетированная реклама', 'Отслеживание конверсий', 'Персонализация'],
      purpose: 'Помогают показывать релевантную рекламу'
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
                <Cookie className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Политика <span className="text-primary">cookies</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Информация о том, как мы используем cookies и как вы можете управлять ими
              </p>
              <div className="text-sm text-muted-foreground">
                Последнее обновление: 17 октября 2025 года
              </div>
            </div>
          </div>
        </section>

        {/* Cookie Settings */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Управление cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Вы можете управлять настройками cookies ниже. Обратите внимание, 
                  что отключение некоторых cookies может повлиять на функциональность сайта.
                </p>
                
                <div className="space-y-6">
                  {cookieTypes.map((type) => (
                    <div key={type.name} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <type.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{type.name}</h3>
                          {type.required && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Обязательные
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                        <p className="text-xs text-muted-foreground mb-3">{type.purpose}</p>
                        <div className="text-xs text-muted-foreground">
                          <strong>Примеры:</strong> {type.examples.join(', ')}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {type.required ? (
                          <Button variant="outline" size="sm" disabled>
                            Обязательные
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            Включить
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <Button>Принять все</Button>
                  <Button variant="outline">Сохранить настройки</Button>
                  <Button variant="outline">Отклонить все</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detailed Information */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Что такое cookies?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Cookies — это небольшие текстовые файлы, которые сохраняются на вашем устройстве 
                    при посещении веб-сайтов. Они помогают сайтам запоминать информацию о ваших 
                    предпочтениях и улучшают ваш опыт использования.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Как мы используем cookies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Аутентификация и безопасность:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Сохранение сессии пользователя</li>
                      <li>Защита от CSRF атак</li>
                      <li>Проверка подлинности запросов</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Функциональность:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Запоминание настроек темы (светлая/тёмная)</li>
                      <li>Сохранение языковых предпочтений</li>
                      <li>Запоминание состояния форм</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Аналитика:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Подсчёт посещений и уникальных пользователей</li>
                      <li>Анализ популярных страниц</li>
                      <li>Отслеживание ошибок и проблем</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Сторонние cookies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Мы используем следующие сторонние сервисы:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li><strong>Google Analytics:</strong> для анализа использования сайта</li>
                      <li><strong>Clerk:</strong> для аутентификации пользователей</li>
                      <li><strong>Vercel:</strong> для аналитики производительности</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Управление сторонними cookies:</h4>
                    <p className="text-muted-foreground">
                      Вы можете управлять cookies сторонних сервисов через их настройки 
                      или отключить их в настройках вашего браузера.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Управление cookies в браузере</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Chrome:</h4>
                    <p className="text-muted-foreground">
                      Настройки → Конфиденциальность и безопасность → Cookies и другие данные сайтов
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Firefox:</h4>
                    <p className="text-muted-foreground">
                      Настройки → Приватность и защита → Cookies и данные сайтов
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Safari:</h4>
                    <p className="text-muted-foreground">
                      Настройки → Конфиденциальность → Управление данными веб-сайтов
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Edge:</h4>
                    <p className="text-muted-foreground">
                      Настройки → Cookies и разрешения сайтов → Cookies и данные сайтов
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Сроки хранения cookies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Сессионные cookies:</span>
                      <span className="font-medium">До закрытия браузера</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Постоянные cookies:</span>
                      <span className="font-medium">До 2 лет</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Аналитические cookies:</span>
                      <span className="font-medium">До 2 лет</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Функциональные cookies:</span>
                      <span className="font-medium">До 1 года</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Контакты</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Если у вас есть вопросы о нашей политике cookies, 
                    обращайтесь по email: privacy@radonai.com
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
