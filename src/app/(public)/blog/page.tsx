import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  ArrowRight,
  BookOpen,
  TrendingUp,
  Lightbulb,
  Code,
  Brain
} from 'lucide-react'

export default function BlogPage() {
  const featuredPost = {
    title: 'Запуск Radon AI: Российская нейросеть нового поколения',
    excerpt: 'Подробный рассказ о создании мультимодальной нейросети с 30 миллиардами параметров и её возможностях.',
    author: 'MagistrTheOne',
    date: '17 октября 2025',
    readTime: '8 мин чтения',
    category: 'Анонсы',
    image: '/blog/radon-ai-launch.jpg',
    featured: true
  }

  const posts = [
    {
      title: 'Архитектура мультимодальных моделей: от теории к практике',
      excerpt: 'Разбираем, как устроены современные мультимодальные нейросети и какие подходы мы использовали в Radon AI.',
      author: 'MagistrTheOne',
      date: '17 октября 2025',
      readTime: '12 мин чтения',
      category: 'Технологии',
      image: '/blog/multimodal-architecture.jpg'
    },
    {
      title: 'Обучение нейросети на русском языке: вызовы и решения',
      excerpt: 'Особенности обучения больших языковых моделей на русском языке и способы оптимизации качества.',
      author: 'MagistrTheOne',
      date: '17 октября 2025',
      readTime: '10 мин чтения',
      category: 'ML/AI',
      image: '/blog/russian-language-training.jpg'
    },
    {
      title: 'API для ИИ: проектирование масштабируемых решений',
      excerpt: 'Как мы создавали API для Radon AI, обеспечивающий высокую производительность и удобство использования.',
      author: 'MagistrTheOne',
      date: '17 октября 2025',
      readTime: '7 мин чтения',
      category: 'Разработка',
      image: '/blog/ai-api-design.jpg'
    },
    {
      title: 'Безопасность данных в эпоху ИИ: российский подход',
      excerpt: 'Как мы обеспечиваем безопасность пользовательских данных и соответствие российскому законодательству.',
      author: 'MagistrTheOne',
      date: '17 октября 2025',
      readTime: '6 мин чтения',
      category: 'Безопасность',
      image: '/blog/ai-data-security.jpg'
    },
    {
      title: 'Сравнение Radon AI с зарубежными аналогами',
      excerpt: 'Честное сравнение возможностей нашей нейросети с ChatGPT, Claude и другими популярными моделями.',
      author: 'MagistrTheOne',
      date: '17 октября 2025',
      readTime: '9 мин чтения',
      category: 'Сравнения',
      image: '/blog/ai-comparison.jpg'
    },
    {
      title: 'Будущее ИИ в России: перспективы и возможности',
      excerpt: 'Размышления о том, как искусственный интеллект может изменить российскую IT-индустрию.',
      author: 'MagistrTheOne',
      date: '17 октября 2025',
      readTime: '11 мин чтения',
      category: 'Аналитика',
      image: '/blog/ai-future-russia.jpg'
    }
  ]

  const categories = [
    { name: 'Все', count: 12, icon: BookOpen },
    { name: 'Анонсы', count: 2, icon: TrendingUp },
    { name: 'Технологии', count: 3, icon: Code },
    { name: 'ML/AI', count: 3, icon: Brain },
    { name: 'Разработка', count: 2, icon: Code },
    { name: 'Безопасность', count: 1, icon: Brain },
    { name: 'Сравнения', count: 1, icon: TrendingUp },
    { name: 'Аналитика', count: 1, icon: Lightbulb }
  ]

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Анонсы': 'bg-blue-500',
      'Технологии': 'bg-green-500',
      'ML/AI': 'bg-purple-500',
      'Разработка': 'bg-orange-500',
      'Безопасность': 'bg-red-500',
      'Сравнения': 'bg-yellow-500',
      'Аналитика': 'bg-indigo-500'
    }
    return colors[category] || 'bg-gray-500'
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
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Блог <span className="text-primary">Radon AI</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Статьи о разработке ИИ, технологиях и будущем искусственного интеллекта в России
              </p>
              
              {/* Search */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Поиск по статьям..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Рекомендуемая статья
              </h2>
            </div>

            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-8 lg:p-12">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={`${getCategoryColor(featuredPost.category)} text-white`}>
                      {featuredPost.category}
                    </Badge>
                    <Badge variant="outline">Рекомендуем</Badge>
                  </div>
                  <CardTitle className="text-2xl lg:text-3xl mb-4">
                    {featuredPost.title}
                  </CardTitle>
                  <CardDescription className="text-lg mb-6">
                    {featuredPost.excerpt}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <Button size="lg">
                    Читать статью
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="bg-muted/50 flex items-center justify-center p-8">
                  <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Categories and Posts */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Категории</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer">
                          <div className="flex items-center gap-2">
                            <category.icon className="w-4 h-4" />
                            <span className="text-sm">{category.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Posts Grid */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <Card key={post.title} className="hover:shadow-lg transition-shadow">
                      <div className="bg-muted/50 h-48 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getCategoryColor(post.category)} text-white text-xs`}>
                            {post.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          Читать
                          <ArrowRight className="w-3 h-3 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Загрузить ещё
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Подписка на обновления
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Получайте новые статьи прямо на почту
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Ваш email"
                className="flex-1"
              />
              <Button className="px-8">
                Подписаться
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Без спама. Отписаться можно в любое время.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
