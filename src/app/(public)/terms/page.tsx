import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Scale, AlertTriangle, Shield } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Условия <span className="text-primary">использования</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Правила использования сервиса Radon AI и ваши права и обязанности
              </p>
              <div className="text-sm text-muted-foreground">
                Последнее обновление: 17 октября 2025 года
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
                    <Scale className="w-5 h-5" />
                    1. Принятие условий
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Используя сервис Radon AI, вы соглашаетесь с данными условиями использования. 
                    Если вы не согласны с какими-либо положениями, пожалуйста, не используйте наш сервис.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>2. Описание сервиса</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Radon AI — это мультимодальная нейросеть с 30 миллиардами параметров, 
                    предоставляющая следующие возможности:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Генерация текста на основе промптов</li>
                    <li>Анализ и описание изображений</li>
                    <li>Создание и анализ кода</li>
                    <li>API для интеграции в сторонние приложения</li>
                    <li>Веб-интерфейс для взаимодействия с нейросетью</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>3. Регистрация и аккаунт</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Требования к аккаунту:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Вам должно быть не менее 18 лет</li>
                      <li>Предоставление достоверной информации</li>
                      <li>Ответственность за безопасность аккаунта</li>
                      <li>Один аккаунт на человека</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Запрещено:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Создание множественных аккаунтов</li>
                      <li>Передача аккаунта третьим лицам</li>
                      <li>Использование чужих данных для регистрации</li>
                      <li>Создание аккаунтов с нарушением законодательства</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    4. Ограничения использования
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Запрещённые действия:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Генерация незаконного контента</li>
                      <li>Создание вредоносного программного обеспечения</li>
                      <li>Нарушение авторских прав</li>
                      <li>Распространение дезинформации</li>
                      <li>Создание контента, нарушающего права человека</li>
                      <li>Попытки взлома или нарушения безопасности</li>
                      <li>Коммерческое использование без соответствующей лицензии</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Технические ограничения:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Соблюдение лимитов тарифного плана</li>
                      <li>Запрет на автоматизированные запросы без разрешения</li>
                      <li>Ограничения на размер загружаемых файлов</li>
                      <li>Соблюдение rate limiting</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>5. Тарифы и оплата</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Тарифные планы:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Free: бесплатный план с ограничениями</li>
                      <li>Pro: платный план с расширенными возможностями</li>
                      <li>Enterprise: корпоративный план с индивидуальными условиями</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Оплата:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Оплата производится авансом</li>
                      <li>Автоматическое продление подписки</li>
                      <li>Возможность отмены в любое время</li>
                      <li>Возврат средств в течение 14 дней</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>6. Интеллектуальная собственность</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Наши права:</h4>
                    <p className="text-muted-foreground">
                      Radon AI, включая нейросеть, API, веб-интерфейс и документацию, 
                      являются интеллектуальной собственностью MagistrTheOne.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Ваши права:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Право на использование сервиса в рамках тарифа</li>
                      <li>Право на контент, созданный с помощью Radon AI</li>
                      <li>Право на интеграцию API в ваши приложения</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Ограничения:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Запрет на обратную инженерию</li>
                      <li>Запрет на копирование или клонирование сервиса</li>
                      <li>Запрет на использование для создания конкурентов</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    7. Ответственность и гарантии
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Ограничение ответственности:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Сервис предоставляется &quot;как есть&quot;</li>
                      <li>Мы не гарантируем точность генерируемого контента</li>
                      <li>Ответственность за использование контента лежит на пользователе</li>
                      <li>Максимальная ответственность ограничена суммой оплаты</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Ваша ответственность:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Проверка точности генерируемого контента</li>
                      <li>Соблюдение законодательства при использовании</li>
                      <li>Защита конфиденциальной информации</li>
                      <li>Ответственность за действия от вашего имени</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>8. Прекращение использования</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Ваше право на прекращение:</h4>
                    <p className="text-muted-foreground">
                      Вы можете прекратить использование сервиса в любое время, 
                      отменив подписку и удалив аккаунт.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Наше право на прекращение:</h4>
                    <p className="text-muted-foreground">
                      Мы можем приостановить или прекратить ваш доступ при нарушении 
                      данных условий или законодательства.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>9. Изменения условий</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Мы можем изменять данные условия. О существенных изменениях 
                    мы уведомим вас за 30 дней. Продолжение использования означает 
                    согласие с новыми условиями.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>10. Контакты и разрешение споров</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Контакты:</h4>
                    <p className="text-muted-foreground">
                      Email: legal@radonai.com<br />
                      Адрес: Краснодар, Россия
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Применимое право:</h4>
                    <p className="text-muted-foreground">
                      Данные условия регулируются законодательством Российской Федерации. 
                      Все споры разрешаются в судах по месту нахождения компании.
                    </p>
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
