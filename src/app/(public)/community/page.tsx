import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Users, 
  Github, 
  Twitter, 
  Linkedin, 
  Calendar,
  MapPin,
  ExternalLink,
  Heart,
  Star,
  Share2
} from 'lucide-react'

export default function CommunityPage() {
  const platforms = [
    {
      name: 'Discord',
      description: 'Основное сообщество разработчиков',
      members: '2,500+',
      activity: 'Очень высокая',
      icon: MessageCircle,
      color: 'bg-indigo-500',
      link: '#',
      features: ['Ежедневные обсуждения', 'Прямая связь с командой', 'Совместная работа над проектами']
    },
    {
      name: 'GitHub',
      description: 'Open source проекты и примеры',
      members: '1,200+',
      activity: 'Высокая',
      icon: Github,
      color: 'bg-gray-800',
      link: '#',
      features: ['Примеры кода', 'SDK и библиотеки', 'Issue tracking']
    },
    {
      name: 'Telegram',
      description: 'Быстрые обновления и новости',
      members: '800+',
      activity: 'Средняя',
      icon: MessageCircle,
      color: 'bg-blue-500',
      link: '#',
      features: ['Анонсы обновлений', 'Быстрая поддержка', 'Обмен опытом']
    },
    {
      name: 'Twitter',
      description: 'Новости и обсуждения',
      members: '3,000+',
      activity: 'Высокая',
      icon: Twitter,
      color: 'bg-sky-500',
      link: '#',
      features: ['Технические треды', 'Новости ИИ', 'Сетевые возможности']
    }
  ]

  const events = [
    {
      title: 'Radon AI Hackathon 2025',
      date: '17 октября 2025',
      location: 'Онлайн + Москва',
      description: '48-часовой хакатон по созданию приложений с Radon AI',
      participants: '150+',
      prize: '500,000 ₽',
      status: 'upcoming'
    },
    {
      title: 'AI Meetup: Мультимодальные модели',
      date: '17 октября 2025',
      location: 'Санкт-Петербург',
      description: 'Встреча разработчиков и обсуждение трендов в ИИ',
      participants: '80+',
      prize: null,
      status: 'upcoming'
    },
    {
      title: 'Radon AI Workshop',
      date: '17 октября 2025',
      location: 'Онлайн',
      description: 'Практический воркшоп по интеграции API',
      participants: '200+',
      prize: null,
      status: 'completed'
    }
  ]

  const contributors = [
    {
      name: 'Алексей Петров',
      role: 'Core Developer',
      contributions: '150+',
      avatar: 'AP',
      github: '#',
      twitter: '#'
    },
    {
      name: 'Мария Сидорова',
      role: 'Community Manager',
      contributions: '80+',
      avatar: 'МС',
      github: '#',
      twitter: '#'
    },
    {
      name: 'Дмитрий Козлов',
      role: 'SDK Maintainer',
      contributions: '120+',
      avatar: 'ДК',
      github: '#',
      twitter: '#'
    },
    {
      name: 'Анна Волкова',
      role: 'Documentation',
      contributions: '90+',
      avatar: 'АВ',
      github: '#',
      twitter: '#'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-500 text-white">Предстоящее</Badge>
      case 'completed':
        return <Badge variant="outline">Завершено</Badge>
      default:
        return <Badge variant="secondary">Неизвестно</Badge>
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
                Сообщество <span className="text-primary">Radon AI</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Присоединяйтесь к сообществу разработчиков, использующих российскую мультимодальную нейросеть
              </p>
              <div className="flex items-center justify-center gap-8 text-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  <span className="font-semibold">7,500+ участников</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  <span className="font-semibold">Активное сообщество</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platforms */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Платформы сообщества
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Выберите удобную для вас платформу для общения и обмена опытом
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {platforms.map((platform) => (
                <Card key={platform.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center`}>
                          <platform.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{platform.name}</CardTitle>
                          <CardDescription>{platform.description}</CardDescription>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={platform.link}>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Участники:</span>
                        <span className="font-medium">{platform.members}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Активность:</span>
                        <span className="font-medium">{platform.activity}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Особенности:</h4>
                        <ul className="space-y-1">
                          {platform.features.map((feature) => (
                            <li key={feature} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button className="w-full">
                        Присоединиться
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Events */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                События сообщества
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Участвуйте в хакатонах, митапах и воркшопах
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Card key={event.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      {getStatusBadge(event.status)}
                    </div>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Дата:</span>
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Место:</span>
                        <span className="font-medium">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Участники:</span>
                        <span className="font-medium">{event.participants}</span>
                      </div>
                      {event.prize && (
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-muted-foreground">Призовой фонд:</span>
                          <span className="font-medium text-yellow-600">{event.prize}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        Участвовать
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contributors */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Активные участники
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Знакомьтесь с людьми, которые делают Radon AI лучше
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contributors.map((contributor) => (
                <Card key={contributor.name} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-lg font-semibold text-primary">
                        {contributor.avatar}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{contributor.name}</CardTitle>
                    <CardDescription>{contributor.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Вклад:</span>
                        <span className="font-medium ml-1">{contributor.contributions}</span>
                      </div>
                      
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <a href={contributor.github}>
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <a href={contributor.twitter}>
                            <Twitter className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Присоединяйтесь к сообществу
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Станьте частью растущего сообщества разработчиков ИИ в России
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                <MessageCircle className="w-5 h-5 mr-2" />
                Присоединиться к Discord
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Github className="w-5 h-5 mr-2" />
                Следить на GitHub
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
