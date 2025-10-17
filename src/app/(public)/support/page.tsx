import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Mail, 
  MessageCircle, 
  HelpCircle, 
  BookOpen, 
  Clock, 
  CheckCircle,
  Send,
  User,
  MessageSquare
} from 'lucide-react'

export default function SupportPage() {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Чат поддержки',
      description: 'Получите мгновенную помощь от нашей команды',
      responseTime: 'В течение 50 минут',
      availability: '24/7',
      action: 'Начать чат'
    },
    {
      icon: Mail,
      title: 'Email поддержка',
      description: 'Отправьте подробное описание проблемы',
      responseTime: 'В течение 2 часов',
      availability: '24/7',
      action: 'Отправить email'
    },
    {
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Найдите ответы на частые вопросы',
      responseTime: 'Мгновенно',
      availability: '24/7',
      action: 'Просмотреть FAQ'
    },
    {
      icon: BookOpen,
      title: 'Документация',
      description: 'Подробные руководства и инструкции',
      responseTime: 'Мгновенно',
      availability: '24/7',
      action: 'Открыть документацию'
    }
  ]

  const faqCategories = [
    {
      title: 'Начало работы',
      questions: [
        'Как создать аккаунт?',
        'Как получить API ключ?',
        'Какие есть ограничения?'
      ]
    },
    {
      title: 'API и интеграция',
      questions: [
        'Как использовать API?',
        'Какие форматы данных поддерживаются?',
        'Как обрабатывать ошибки?'
      ]
    },
    {
      title: 'Тарифы и биллинг',
      questions: [
        'Как изменить тариф?',
        'Как отменить подписку?',
        'Как получить счёт?'
      ]
    },
    {
      title: 'Технические вопросы',
      questions: [
        'Почему медленно работает API?',
        'Как увеличить лимиты?',
        'Что делать при ошибках?'
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
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Служба <span className="text-primary">поддержки</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Мы здесь, чтобы помочь вам с любыми вопросами по Radon AI
              </p>
              <div className="flex items-center justify-center gap-2 text-lg">
                <Clock className="w-6 h-6 text-green-500" />
                <span className="font-semibold">Среднее время ответа: 2 минуты</span>
              </div>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Способы получения помощи
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Выберите наиболее удобный для вас способ связи
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportOptions.map((option) => (
                <Card key={option.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <option.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Ответ:</span>
                        <span className="font-medium">{option.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Доступность:</span>
                        <span className="font-medium">{option.availability}</span>
                      </div>
                    </div>
                    <Button className="w-full">
                      {option.action}
                    </Button>
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
                Связаться с нами
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Опишите вашу проблему, и мы поможем вам её решить
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Отправить сообщение
                </CardTitle>
                <CardDescription>
                  Заполните форму ниже, и мы ответим в течение 2 часов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Имя</label>
                      <Input placeholder="Ваше имя" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="your@email.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Тема</label>
                    <Input placeholder="Краткое описание проблемы" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Категория</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                      <option>Общие вопросы</option>
                      <option>Техническая поддержка</option>
                      <option>API и интеграция</option>
                      <option>Тарифы и биллинг</option>
                      <option>Сообщить об ошибке</option>
                      <option>Предложение по улучшению</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Сообщение</label>
                    <Textarea 
                      placeholder="Подробно опишите вашу проблему или вопрос..."
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Приоритет</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                      <option>Низкий</option>
                      <option>Средний</option>
                      <option>Высокий</option>
                      <option>Критический</option>
                    </select>
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

        {/* FAQ Preview */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Частые вопросы
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Возможно, ответ на ваш вопрос уже есть в нашей базе знаний
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqCategories.map((category) => (
                <Card key={category.title}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.questions.map((question) => (
                        <li key={question}>
                          <a 
                            href="#" 
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {question}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full mt-4">
                      Показать все вопросы
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Другие способы связи
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Свяжитесь с нами любым удобным способом
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground mb-4">
                  maxonyushko71@gmail.com
                </p>
                <p className="text-sm text-muted-foreground">
                  Ответ в течение 2 часов
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Discord</h3>
                <p className="text-muted-foreground mb-4">
                  @radonai_support
                </p>
                <p className="text-sm text-muted-foreground">
                  Мгновенная поддержка
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Telegram</h3>
                <p className="text-muted-foreground mb-4">
                  @radonai_help
                </p>
                <p className="text-sm text-muted-foreground">
                  Быстрые ответы
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
