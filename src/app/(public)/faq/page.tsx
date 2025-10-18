"use client"

import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Search, HelpCircle, ChevronRight } from 'lucide-react'

export default function FaqPage() {
  const faqData = [
    {
      category: 'Начало работы',
      icon: '🚀',
      questions: [
        {
          question: 'Как создать аккаунт в Radon AI?',
          answer: 'Создать аккаунт очень просто! Нажмите кнопку "Начать" в правом верхнем углу, выберите способ регистрации (email, Google или GitHub) и следуйте инструкциям. Регистрация займёт не более 2 минут.'
        },
        {
          question: 'Как получить API ключ?',
          answer: 'После регистрации перейдите в раздел "Настройки" → "API ключи" и нажмите "Создать новый ключ". Ключ будет сгенерирован мгновенно и доступен для копирования.'
        },
        {
          question: 'Какие есть ограничения для бесплатного тарифа?',
          answer: 'Бесплатный тариф включает 10 запросов в день, базовую поддержку и историю чатов на 7 дней. Для увеличения лимитов рекомендуем перейти на Pro тариф.'
        },
        {
          question: 'Как начать использовать API?',
          answer: 'Получите API ключ, изучите документацию на странице /api, и начните с простых запросов. Мы предоставляем примеры кода на Python, JavaScript, cURL и других языках.'
        }
      ]
    },
    {
      category: 'API и интеграция',
      icon: '⚡',
      questions: [
        {
          question: 'Какие форматы данных поддерживает API?',
          answer: 'API поддерживает JSON для всех запросов и ответов. Для изображений принимаются форматы JPG, PNG, WebP до 5MB. Текстовые запросы поддерживают UTF-8 кодировку.'
        },
        {
          question: 'Как обрабатывать ошибки API?',
          answer: 'API возвращает стандартные HTTP коды статуса. 200 - успех, 400 - ошибка запроса, 401 - неверный API ключ, 429 - превышен лимит, 500 - ошибка сервера. Всегда проверяйте код ответа.'
        },
        {
          question: 'Есть ли rate limiting?',
          answer: 'Да, для защиты сервиса действуют ограничения: Free - 5 запросов/минуту, Pro - 50 запросов/минуту, Enterprise - без ограничений. При превышении возвращается код 429.'
        },
        {
          question: 'Поддерживается ли streaming?',
          answer: 'Да! Для получения ответов в реальном времени используйте endpoint /v1/chat/stream. Это позволяет отображать ответы по мере их генерации, как в ChatGPT.'
        }
      ]
    },
    {
      category: 'Тарифы и биллинг',
      icon: '💳',
      questions: [
        {
          question: 'Как изменить тарифный план?',
          answer: 'Перейдите в "Настройки" → "Подписка" и выберите нужный тариф. Изменения вступают в силу немедленно. При переходе на более дорогой план вы платите пропорционально.'
        },
        {
          question: 'Можно ли отменить подписку?',
          answer: 'Да, вы можете отменить подписку в любое время в разделе "Настройки" → "Подписка". После отмены вы сохраните доступ до конца оплаченного периода.'
        },
        {
          question: 'Как получить счёт или чек?',
          answer: 'Все счета и чеки автоматически отправляются на email, указанный при регистрации. Также их можно скачать в разделе "Биллинг" в настройках аккаунта.'
        },
        {
          question: 'Есть ли скидки для студентов?',
          answer: 'Да! Студенты могут получить скидку 50% на Pro тариф. Для этого отправьте документ, подтверждающий статус студента, на support@radonai.com.'
        }
      ]
    },
    {
      category: 'Технические вопросы',
      icon: '🔧',
      questions: [
        {
          question: 'Почему API работает медленно?',
          answer: 'Скорость зависит от сложности запроса и текущей нагрузки. Для текста: 200-500ms, для изображений: 1-3 секунды. При высокой нагрузке время может увеличиться.'
        },
        {
          question: 'Как увеличить лимиты запросов?',
          answer: 'Перейдите на более высокий тариф или свяжитесь с нами для индивидуальных условий. Enterprise клиенты могут получить кастомные лимиты.'
        },
        {
          question: 'Что делать при ошибке 500?',
          answer: 'Ошибка 500 означает проблему на нашей стороне. Проверьте статус системы на /status. Если проблема не решается, обратитесь в поддержку.'
        },
        {
          question: 'Как обеспечить безопасность API ключей?',
          answer: 'Никогда не передавайте API ключи в клиентском коде. Используйте переменные окружения, ротируйте ключи регулярно и следите за их использованием в логах.'
        }
      ]
    },
    {
      category: 'Безопасность и конфиденциальность',
      icon: '🔒',
      questions: [
        {
          question: 'Безопасны ли мои данные?',
          answer: 'Да! Все данные шифруются при передаче (TLS 1.3) и хранении (AES-256). Мы не используем ваши данные для обучения моделей и не передаём их третьим лицам.'
        },
        {
          question: 'Можно ли удалить мои данные?',
          answer: 'Да, вы можете удалить все свои данные в настройках аккаунта. Также можете запросить полное удаление через GDPR форму на странице /gdpr.'
        },
        {
          question: 'Где хранятся данные?',
          answer: 'Данные хранятся в защищённых дата-центрах в России с соблюдением всех требований безопасности и законодательства о персональных данных.'
        },
        {
          question: 'Есть ли аудит безопасности?',
          answer: 'Да, мы регулярно проводим аудит безопасности и имеем сертификаты соответствия. Подробности доступны по запросу для Enterprise клиентов.'
        }
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
                Часто задаваемые <span className="text-primary">вопросы</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Найдите ответы на самые популярные вопросы о Radon AI
              </p>
              
              {/* Search */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Поиск по вопросам..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Категории вопросов
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Выберите интересующую вас тему
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {faqData.map((category) => (
                <Card key={category.category} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      {category.category}
                    </CardTitle>
                    <CardDescription>
                      {category.questions.length} вопросов
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Просмотреть вопросы
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {faqData.map((category) => (
                <div key={category.category}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    {category.category}
                  </h2>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.category}-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still have questions */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Не нашли ответ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Наша команда поддержки готова помочь вам с любыми вопросами
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Связаться с поддержкой
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Открыть документацию
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
