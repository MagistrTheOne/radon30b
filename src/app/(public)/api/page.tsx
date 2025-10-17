import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Code, Key, Zap, Shield, Globe, Copy } from 'lucide-react'

export default function ApiPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Radon AI <span className="text-primary">API</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Мощный REST API для интеграции мультимодальной нейросети 30B параметров 
                в ваши приложения
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8">
                  <Key className="w-5 h-5 mr-2" />
                  Получить API ключ
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  <Code className="w-5 h-5 mr-2" />
                  Документация
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Возможности API
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Полный набор инструментов для работы с мультимодальной нейросетью
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Быстрые ответы</CardTitle>
                  <CardDescription>
                    Низкая задержка и высокая пропускная способность
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Средняя задержка: 200ms</li>
                    <li>• До 1000 запросов/минуту</li>
                    <li>• Streaming поддержка</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Безопасность</CardTitle>
                  <CardDescription>
                    Защита данных и аутентификация
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• API ключи с ротацией</li>
                    <li>• Rate limiting</li>
                    <li>• Шифрование данных</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Мультимодальность</CardTitle>
                  <CardDescription>
                    Текст, изображения и код в одном API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Текстовая генерация</li>
                    <li>• Анализ изображений</li>
                    <li>• Кодогенерация</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* API Examples */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Примеры использования
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Быстрый старт с примерами кода на разных языках
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Text Generation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Текстовая генерация
                  </CardTitle>
                  <CardDescription>
                    Создание контента с помощью API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto">
{`curl -X POST https://api.radonai.com/v1/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Напиши статью о ИИ",
    "max_tokens": 1000,
    "temperature": 0.7
  }'`}
                    </pre>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Копировать код
                  </Button>
                </CardContent>
              </Card>

              {/* Image Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Анализ изображений
                  </CardTitle>
                  <CardDescription>
                    Описание и анализ изображений
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto">
{`curl -X POST https://api.radonai.com/v1/vision \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image_url": "https://example.com/image.jpg",
    "prompt": "Опиши что видишь на изображении"
  }'`}
                    </pre>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Копировать код
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Тарифы API
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Гибкие тарифы для разработчиков и предприятий
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>Для тестирования и разработки</CardDescription>
                  <div className="text-3xl font-bold">$0</div>
                  <div className="text-sm text-muted-foreground">/месяц</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Badge variant="secondary">1K</Badge>
                      <span className="text-sm">запросов в месяц</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="secondary">5</Badge>
                      <span className="text-sm">запросов в минуту</span>
                    </li>
                    <li className="text-sm text-muted-foreground">• Базовая поддержка</li>
                  </ul>
                  <Button className="w-full">Начать бесплатно</Button>
                </CardContent>
              </Card>

              <Card className="border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Pro</CardTitle>
                    <Badge className="bg-primary">Популярный</Badge>
                  </div>
                  <CardDescription>Для production приложений</CardDescription>
                  <div className="text-3xl font-bold">$99</div>
                  <div className="text-sm text-muted-foreground">/месяц</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Badge variant="secondary">100K</Badge>
                      <span className="text-sm">запросов в месяц</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="secondary">50</Badge>
                      <span className="text-sm">запросов в минуту</span>
                    </li>
                    <li className="text-sm text-muted-foreground">• Приоритетная поддержка</li>
                    <li className="text-sm text-muted-foreground">• SLA 99.9%</li>
                  </ul>
                  <Button className="w-full">Выбрать Pro</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>Для крупных проектов</CardDescription>
                  <div className="text-3xl font-bold">Custom</div>
                  <div className="text-sm text-muted-foreground">по запросу</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Badge variant="secondary">∞</Badge>
                      <span className="text-sm">запросов в месяц</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="secondary">∞</Badge>
                      <span className="text-sm">запросов в минуту</span>
                    </li>
                    <li className="text-sm text-muted-foreground">• Персональный менеджер</li>
                    <li className="text-sm text-muted-foreground">• Dedicated инфраструктура</li>
                  </ul>
                  <Button variant="outline" className="w-full">Связаться с нами</Button>
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
