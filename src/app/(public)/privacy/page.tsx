import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Eye, Lock, Database, UserCheck, Mail } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Политика <span className="text-primary">конфиденциальности</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Мы серьёзно относимся к защите ваших персональных данных и соблюдаем все требования законодательства
              </p>
              <div className="text-sm text-muted-foreground">
                Последнее обновление: 15 августа 2025 года
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    1. Какие данные мы собираем
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Персональные данные:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Email адрес (для регистрации и уведомлений)</li>
                      <li>Имя и фамилия (при регистрации)</li>
                      <li>IP адрес (для безопасности и аналитики)</li>
                      <li>Информация об устройстве и браузере</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Данные использования:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>История запросов к API</li>
                      <li>Время и частота использования сервиса</li>
                      <li>Типы запросов (текст, изображения, код)</li>
                      <li>Ошибки и проблемы при использовании</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    2. Как мы используем ваши данные
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Основные цели:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Предоставление доступа к сервису Radon AI</li>
                      <li>Обработка ваших запросов и генерация ответов</li>
                      <li>Улучшение качества работы нейросети</li>
                      <li>Техническая поддержка и решение проблем</li>
                      <li>Соблюдение лимитов тарифного плана</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Аналитика и улучшения:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Анализ использования для улучшения сервиса</li>
                      <li>Выявление и исправление ошибок</li>
                      <li>Оптимизация производительности</li>
                      <li>Разработка новых функций</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    3. Хранение и защита данных
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Безопасность:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Шифрование данных при передаче (TLS 1.3)</li>
                      <li>Шифрование данных при хранении (AES-256)</li>
                      <li>Регулярные резервные копии</li>
                      <li>Контроль доступа и аудит</li>
                      <li>Защита от DDoS атак</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Местоположение:</h4>
                    <p className="text-muted-foreground">
                      Все данные хранятся в защищённых дата-центрах на территории Российской Федерации 
                      в соответствии с требованиями законодательства о персональных данных.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Сроки хранения:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Персональные данные: до удаления аккаунта</li>
                      <li>История запросов: 30 дней (Free), 1 год (Pro)</li>
                      <li>Логи безопасности: 90 дней</li>
                      <li>Аналитические данные: в анонимизированном виде до 2 лет</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    4. Ваши права
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">В соответствии с GDPR и российским законодательством:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Право на доступ к вашим данным</li>
                      <li>Право на исправление неточных данных</li>
                      <li>Право на удаление данных (&quot;право на забвение&quot;)</li>
                      <li>Право на ограничение обработки</li>
                      <li>Право на портируемость данных</li>
                      <li>Право на возражение против обработки</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Как реализовать права:</h4>
                    <p className="text-muted-foreground">
                      Для реализации ваших прав обратитесь к нам по email: privacy@radonai.com 
                      или через форму на странице <a href="/gdpr" className="text-primary hover:underline">GDPR</a>.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>5. Передача данных третьим лицам</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Мы не продаём и не передаём ваши персональные данные третьим лицам, 
                    за исключением следующих случаев:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>С вашего явного согласия</li>
                    <li>Для выполнения договорных обязательств</li>
                    <li>По требованию государственных органов в рамках законодательства</li>
                    <li>Для защиты наших прав и интересов</li>
                    <li>При смене владельца компании (с уведомлением пользователей)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>6. Cookies и отслеживание</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Мы используем cookies и аналогичные технологии для:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Аутентификации и безопасности</li>
                    <li>Запоминания ваших настроек</li>
                    <li>Анализа использования сайта</li>
                    <li>Улучшения пользовательского опыта</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Подробнее о cookies читайте в нашей <a href="/cookies" className="text-primary hover:underline">Политике cookies</a>.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>7. Изменения в политике</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Мы можем обновлять данную политику конфиденциальности. 
                    О существенных изменениях мы уведомим вас по email или через уведомления в сервисе. 
                    Продолжение использования сервиса после изменений означает ваше согласие с новой политикой.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    8. Контакты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p>По вопросам конфиденциальности обращайтесь:</p>
                    <p>Email: privacy@radonai.com</p>
                    <p>Адрес: Краснодар, Россия</p>
                    <p>Ответственный за обработку персональных данных: MagistrTheOne</p>
                  </div>
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
