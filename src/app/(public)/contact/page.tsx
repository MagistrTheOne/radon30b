import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Send,
  MessageCircle,
  Github,
  Twitter,
  Linkedin,
  Calendar
} from 'lucide-react'

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Основной способ связи',
      contact: 'hello@radonai.com',
      responseTime: 'В течение 24 часов',
      availability: '24/7'
    },
    {
      icon: MessageCircle,
      title: 'Discord',
      description: 'Быстрая поддержка',
      contact: '@radonai_support',
      responseTime: 'В течение 2 часов',
      availability: '9:00 - 21:00 МСК'
    },
    {
      icon: Phone,
      title: 'Telegram',
      description: 'Мгновенные сообщения',
      contact: '@radonai_help',
      responseTime: 'В течение 1 часа',
      availability: '9:00 - 21:00 МСК'
    }
  ]

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: '#',
      description: 'Исходный код и примеры'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: '#',
      description: 'Новости и обновления'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: '#',
      description: 'Профессиональная сеть'
    }
  ]

  const officeInfo = {
    address: 'Краснодар, Россия',
    timezone: 'МСК (UTC+3)',
    workingHours: 'Пн-Пт: 9:00 - 18:00',
    supportHours: '24/7 для критических вопросов'
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
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Свяжитесь с <span className="text-primary">нами</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                У вас есть вопросы? Идеи? Предложения? Мы всегда рады услышать от вас
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Краснодар, Россия</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>МСК (UTC+3)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Способы связи
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Выберите наиболее удобный для вас способ связи
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactMethods.map((method) => (
                <Card key={method.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <method.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-lg font-semibold text-primary">
                        {method.contact}
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Ответ: {method.responseTime}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Доступность: {method.availability}</span>
                        </div>
                      </div>
                      <Button className="w-full">
                        Связаться
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Отправить сообщение
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Заполните форму ниже, и мы ответим вам в ближайшее время
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Форма обратной связи
                </CardTitle>
                <CardDescription>
                  Все поля обязательны для заполнения
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Имя *</label>
                      <Input placeholder="Ваше имя" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email *</label>
                      <Input type="email" placeholder="your@email.com" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Тема *</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground" required>
                      <option value="">Выберите тему</option>
                      <option value="general">Общие вопросы</option>
                      <option value="technical">Техническая поддержка</option>
                      <option value="business">Бизнес-сотрудничество</option>
                      <option value="media">СМИ и пресса</option>
                      <option value="partnership">Партнёрство</option>
                      <option value="feedback">Отзывы и предложения</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Сообщение *</label>
                    <Textarea 
                      placeholder="Подробно опишите ваш вопрос или предложение..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Приоритет</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                      <option value="low">Низкий</option>
                      <option value="medium">Средний</option>
                      <option value="high">Высокий</option>
                      <option value="urgent">Срочный</option>
                    </select>
                  </div>

                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="consent" required className="mt-1" />
                    <label htmlFor="consent" className="text-sm text-muted-foreground">
                      Я согласен на обработку моих персональных данных в соответствии с 
                      <a href="/privacy" className="text-primary hover:underline"> Политикой конфиденциальности</a>
                    </label>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Отправить сообщение
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Office Info */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Офисная информация
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Основная информация о нашей компании
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Адрес
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="text-lg font-semibold text-foreground">{officeInfo.address}</p>
                    <p>Часовой пояс: {officeInfo.timezone}</p>
                    <p>Рабочие часы: {officeInfo.workingHours}</p>
                    <p>Поддержка: {officeInfo.supportHours}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Социальные сети
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {socialLinks.map((social) => (
                      <div key={social.name} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <social.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{social.name}</div>
                          <div className="text-sm text-muted-foreground">{social.description}</div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={social.url}>Перейти</a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Частые вопросы
              </h2>
              <p className="text-xl text-muted-foreground">
                Быстрые ответы на популярные вопросы
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Как быстро вы отвечаете?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Мы отвечаем на email в течение 24 часов, в Discord и Telegram — в течение 2 часов в рабочее время.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Можно ли встретиться лично?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Да, мы открыты для личных встреч в Краснодаре. Свяжитесь с нами, чтобы договориться о времени.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Предоставляете ли вы консультации?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Да, мы предоставляем консультации по интеграции ИИ в ваши проекты. Стоимость обсуждается индивидуально.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Как стать партнёром?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Отправьте нам сообщение с темой &quot;Партнёрство&quot;, и мы обсудим возможности сотрудничества.
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
