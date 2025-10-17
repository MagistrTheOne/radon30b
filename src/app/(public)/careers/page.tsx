import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  Zap,
  Brain,
  Code,
  Shield,
  Globe,
  Coffee,
  Laptop,
  BookOpen,
  Trophy
} from 'lucide-react'

export default function CareersPage() {
  const openPositions = [
    {
      title: 'Senior ML Engineer',
      department: 'Machine Learning',
      location: 'Краснодар / Удалённо',
      type: 'Полная занятость',
      experience: '3+ года',
      description: 'Разработка и оптимизация нейросетевых моделей для Radon AI',
      requirements: ['Опыт с PyTorch/TensorFlow', 'Знание трансформеров', 'Python', 'CUDA'],
      benefits: ['Конкурентная зарплата', 'Гибкий график', 'Оборудование']
    },
    {
      title: 'Full-Stack Developer',
      department: 'Разработка',
      location: 'Краснодар / Удалённо',
      type: 'Полная занятость',
      experience: '2+ года',
      description: 'Разработка веб-интерфейса и API для Radon AI',
      requirements: ['Next.js/React', 'FastAPI/Python', 'PostgreSQL', 'Docker'],
      benefits: ['Конкурентная зарплата', 'Гибкий график', 'Оборудование']
    },
    {
      title: 'DevOps Engineer',
      department: 'Инфраструктура',
      location: 'Краснодар / Удалённо',
      type: 'Полная занятость',
      experience: '2+ года',
      description: 'Настройка и поддержка инфраструктуры для масштабируемого ИИ',
      requirements: ['Kubernetes', 'Docker', 'AWS/GCP', 'Terraform'],
      benefits: ['Конкурентная зарплата', 'Гибкий график', 'Оборудование']
    },
    {
      title: 'Product Manager',
      department: 'Продукт',
      location: 'Краснодар / Удалённо',
      type: 'Полная занятость',
      experience: '3+ года',
      description: 'Управление продуктом и развитие функциональности Radon AI',
      requirements: ['Опыт в ИИ/ML', 'Аналитика', 'Пользовательский опыт', 'Стратегия'],
      benefits: ['Конкурентная зарплата', 'Гибкий график', 'Оборудование']
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: 'Гибкий график',
      description: 'Работайте в удобное время, главное — результат'
    },
    {
      icon: Laptop,
      title: 'Современное оборудование',
      description: 'Мощные рабочие станции и все необходимые инструменты'
    },
    {
      icon: Heart,
      title: 'Медицинское страхование',
      description: 'Полное медицинское покрытие для вас и семьи'
    },
    {
      icon: BookOpen,
      title: 'Обучение и развитие',
      description: 'Бюджет на курсы, конференции и профессиональный рост'
    },
    {
      icon: Coffee,
      title: 'Комфортный офис',
      description: 'Современный офис в центре Краснодара с зонами отдыха'
    },
    {
      icon: Trophy,
      title: 'Премии и бонусы',
      description: 'Дополнительные выплаты за достижения и результаты'
    }
  ]

  const values = [
    {
      icon: Brain,
      title: 'Инновации',
      description: 'Мы создаём технологии будущего и не боимся экспериментировать'
    },
    {
      icon: Users,
      title: 'Команда',
      description: 'Поддерживаем друг друга и работаем как единая команда'
    },
    {
      icon: Globe,
      title: 'Влияние',
      description: 'Наша работа влияет на развитие ИИ в России и мире'
    },
    {
      icon: Shield,
      title: 'Безопасность',
      description: 'Приоритет — защита данных пользователей и конфиденциальность'
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
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Карьера в <span className="text-primary">Radon AI</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Присоединяйтесь к команде, которая создаёт будущее искусственного интеллекта в России
              </p>
              <div className="flex items-center justify-center gap-8 text-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  <span className="font-semibold">Растущая команда</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  <span className="font-semibold">Краснодар + Удалённо</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  <span className="font-semibold">С любовью к ИИ</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Почему Radon AI?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Мы создаём не просто продукт, а технологию, которая изменит мир
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Что мы предлагаем
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Комплексный пакет льгот и возможностей для развития
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Открытые позиции
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Присоединяйтесь к нашей команде и помогите создать будущее ИИ
              </p>
            </div>

            <div className="space-y-6">
              {openPositions.map((position) => (
                <Card key={position.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                        <CardDescription className="text-base mb-4">
                          {position.description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {position.location}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {position.type}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {position.experience}
                          </Badge>
                          <Badge variant="secondary">{position.department}</Badge>
                        </div>
                      </div>
                      <Button className="ml-4">
                        Откликнуться
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Требования:</h4>
                        <ul className="space-y-1">
                          {position.requirements.map((req) => (
                            <li key={req} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-primary" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Что мы предлагаем:</h4>
                        <ul className="space-y-1">
                          {position.benefits.map((benefit) => (
                            <li key={benefit} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-green-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Не нашли подходящую позицию? Отправьте нам резюме!
              </p>
              <Button variant="outline" size="lg">
                Отправить резюме
              </Button>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Процесс найма
              </h2>
              <p className="text-xl text-muted-foreground">
                Простой и прозрачный процесс от подачи заявки до первого дня работы
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Подача заявки</h3>
                  <p className="text-muted-foreground">
                    Отправьте резюме и сопроводительное письмо. Мы рассмотрим вашу заявку в течение 3 дней.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">2</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Первичное интервью</h3>
                  <p className="text-muted-foreground">
                    30-минутный звонок для знакомства и обсуждения позиции. Обычно проводим в течение недели.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">3</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Техническое интервью</h3>
                  <p className="text-muted-foreground">
                    Обсуждение технических навыков и решение практических задач. 1-2 часа.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">4</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Финальное интервью</h3>
                  <p className="text-muted-foreground">
                    Встреча с командой и обсуждение деталей сотрудничества. Решение принимается в течение 2 дней.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Готовы присоединиться?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Отправьте нам резюме или свяжитесь для обсуждения возможностей
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                <Briefcase className="w-5 h-5 mr-2" />
                Посмотреть вакансии
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Users className="w-5 h-5 mr-2" />
                Связаться с нами
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
