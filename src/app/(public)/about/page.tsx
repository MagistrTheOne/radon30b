import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  MapPin, 
  Calendar, 
  Target, 
  Users, 
  Zap,
  Shield,
  Globe,
  Heart,
  Code,
  Lightbulb
} from 'lucide-react'

export default function AboutPage() {
  const milestones = [
    {
      date: '2025 Q3',
      title: 'Начало разработки',
      description: 'Идея создания российской мультимодальной нейросети'
    },
    {
      date: '2025 Q3',
      title: 'Архитектура модели',
      description: 'Разработка архитектуры с 30B параметрами'
    },
    {
      date: '2025 Q3',
      title: 'Обучение модели',
      description: 'Обучение на российских и международных данных'
    },
    {
      date: '2025 Q3',
      title: 'API и интерфейс',
      description: 'Создание API и веб-интерфейса'
    },
    {
      date: '2025 Q4',
      title: 'Публичный запуск',
      description: 'Запуск сервиса для широкой аудитории'
    }
  ]

  const values = [
    {
      icon: Globe,
      title: 'Российская разработка',
      description: 'Создаём технологии будущего в России, поддерживая отечественную IT-индустрию'
    },
    {
      icon: Shield,
      title: 'Безопасность данных',
      description: 'Все данные хранятся в России с соблюдением требований законодательства'
    },
    {
      icon: Users,
      title: 'Открытость',
      description: 'Делаем мощный ИИ доступным для всех, от студентов до предприятий'
    },
    {
      icon: Lightbulb,
      title: 'Инновации',
      description: 'Используем передовые технологии и постоянно совершенствуем продукт'
    }
  ]

  const team = [
    {
      name: 'MagistrTheOne',
      role: 'Основатель и главный разработчик',
      location: 'Краснодар, Россия',
      bio: 'Full-stack разработчик с опытом в машинном обучении и создании масштабируемых систем. Увлечён созданием технологий, которые делают мир лучше.',
      avatar: 'MT',
      skills: ['Machine Learning', 'Full-Stack Development', 'System Architecture']
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
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                О проекте <span className="text-primary">Radon AI</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Российская мультимодальная нейросеть нового поколения, созданная одним разработчиком из Краснодара
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Краснодар, Россия</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Основан в 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>1 разработчик</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Наша миссия
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Создать передовую мультимодальную нейросеть, которая будет конкурировать с мировыми лидерами, 
                при этом оставаясь российской разработкой, доступной каждому.
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

        {/* Story */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                История проекта
              </h2>
              <p className="text-xl text-muted-foreground">
                Как один разработчик решил создать российскую альтернативу ChatGPT
              </p>
            </div>

            <div className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Всё началось с простой идеи: почему в России нет собственной мощной нейросети? 
                    В то время как зарубежные компании создают всё более совершенные модели ИИ, 
                    российские разработчики остаются в стороне от этой технологической революции.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">
                    MagistrTheOne, разработчик из Краснодара, решил изменить эту ситуацию. 
                    Изучив последние достижения в области трансформеров и мультимодальных моделей, 
                    он начал работу над архитектурой нейросети с 30 миллиардами параметров.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Проект Radon AI — это не просто техническая задача, это стремление доказать, 
                    что российские разработчики способны создавать технологии мирового уровня. 
                    Каждая строка кода, каждый алгоритм — это шаг к технологическому суверенитету России.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Дорожная карта
              </h2>
              <p className="text-xl text-muted-foreground">
                Ключевые этапы развития проекта
              </p>
            </div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">{milestone.date}</Badge>
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Команда
              </h2>
              <p className="text-xl text-muted-foreground">
                Люди, которые создают будущее ИИ в России
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <Card key={member.name} className="text-center">
                  <CardHeader>
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary">{member.avatar}</span>
                    </div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-base">{member.role}</CardDescription>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{member.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Технологии
              </h2>
              <p className="text-xl text-muted-foreground">
                Современный стек технологий для создания нейросети
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Архитектура модели</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Transformer архитектура</li>
                    <li>• 30 миллиардов параметров</li>
                    <li>• Мультимодальные возможности</li>
                    <li>• Оптимизация для русского языка</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Инфраструктура</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• FastAPI для backend</li>
                    <li>• Next.js для frontend</li>
                    <li>• PostgreSQL для данных</li>
                    <li>• Docker для развёртывания</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Производительность</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Оптимизированное инференс</li>
                    <li>• Streaming ответы</li>
                    <li>• Кэширование запросов</li>
                    <li>• Масштабируемость</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Видение будущего
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Radon AI — это не просто нейросеть, это платформа для инноваций
            </p>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Мы видим будущее, где российские разработчики создают технологии мирового уровня, 
                    где искусственный интеллект служит на благо общества, а не контролирует его.
                  </p>
                  <p>
                    Radon AI станет основой для множества приложений: от образовательных платформ 
                    до корпоративных решений, от творческих инструментов до научных исследований.
                  </p>
                  <p>
                    Присоединяйтесь к нам в создании будущего, где технологии объединяют людей, 
                    а не разделяют их.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-12 flex items-center justify-center gap-2 text-lg">
              <Heart className="w-6 h-6 text-red-500" />
              <span className="font-semibold">Сделано с любовью в России</span>
              <span className="text-2xl">🇷🇺</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
