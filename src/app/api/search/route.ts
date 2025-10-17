import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'all'
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Поисковый запрос должен содержать минимум 2 символа' },
        { status: 400 }
      )
    }

    const searchQuery = query.trim().toLowerCase()
    const results = []

    // Поиск по документации
    if (type === 'all' || type === 'docs') {
      const docsResults = await searchDocumentation(searchQuery, limit)
      results.push(...docsResults)
    }

    // Поиск по блогу
    if (type === 'all' || type === 'blog') {
      const blogResults = await searchBlog(searchQuery, limit)
      results.push(...blogResults)
    }

    // Поиск по FAQ
    if (type === 'all' || type === 'faq') {
      const faqResults = await searchFAQ(searchQuery, limit)
      results.push(...faqResults)
    }

    // Сортируем результаты по релевантности
    results.sort((a, b) => b.score - a.score)

    return NextResponse.json({
      query: searchQuery,
      type,
      results: results.slice(0, limit),
      total: results.length
    })

  } catch (error) {
    console.error('Error performing search:', error)
    return NextResponse.json(
      { error: 'Ошибка выполнения поиска' },
      { status: 500 }
    )
  }
}

async function searchDocumentation(query: string, limit: number) {
  // Моковые данные документации
  const docs = [
    {
      id: '1',
      title: 'Начало работы с Radon AI',
      content: 'Radon AI - это мощная мультимодальная нейросеть с 30 миллиардами параметров...',
      url: '/docs/getting-started',
      type: 'docs',
      score: calculateScore(query, 'Начало работы с Radon AI')
    },
    {
      id: '2',
      title: 'API Reference',
      content: 'Полное описание API для интеграции с Radon AI...',
      url: '/docs/api',
      type: 'docs',
      score: calculateScore(query, 'API Reference')
    },
    {
      id: '3',
      title: 'Function Calling',
      content: 'Использование function calling в Radon AI для выполнения задач...',
      url: '/docs/function-calling',
      type: 'docs',
      score: calculateScore(query, 'Function Calling')
    }
  ]

  return docs.filter(doc => doc.score > 0).slice(0, limit)
}

async function searchBlog(query: string, limit: number) {
  // Моковые данные блога
  const blogPosts = [
    {
      id: '1',
      title: 'Новые возможности Radon AI v2.0.0',
      content: 'Мы рады представить обновленную версию Radon AI с новыми возможностями...',
      url: '/blog/radon-ai-v2',
      type: 'blog',
      publishedAt: '2025-10-17',
      score: calculateScore(query, 'Новые возможности Radon AI v2.0.0')
    },
    {
      id: '2',
      title: 'Мультимодальные возможности AI',
      content: 'Обзор мультимодальных возможностей современных нейросетей...',
      url: '/blog/multimodal-ai',
      type: 'blog',
      publishedAt: '2025-10-15',
      score: calculateScore(query, 'Мультимодальные возможности AI')
    }
  ]

  return blogPosts.filter(post => post.score > 0).slice(0, limit)
}

async function searchFAQ(query: string, limit: number) {
  // Моковые данные FAQ
  const faqs = [
    {
      id: '1',
      question: 'Как начать использовать Radon AI?',
      answer: 'Для начала работы с Radon AI необходимо зарегистрироваться...',
      url: '/faq#getting-started',
      type: 'faq',
      score: calculateScore(query, 'Как начать использовать Radon AI?')
    },
    {
      id: '2',
      question: 'Какие тарифы доступны?',
      answer: 'У нас есть несколько тарифных планов: Free, Pro, Team и Enterprise...',
      url: '/faq#pricing',
      type: 'faq',
      score: calculateScore(query, 'Какие тарифы доступны?')
    },
    {
      id: '3',
      question: 'Как работает function calling?',
      answer: 'Function calling позволяет Radon AI выполнять различные задачи...',
      url: '/faq#function-calling',
      type: 'faq',
      score: calculateScore(query, 'Как работает function calling?')
    }
  ]

  return faqs.filter(faq => faq.score > 0).slice(0, limit)
}

function calculateScore(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(' ')
  const textLower = text.toLowerCase()
  
  let score = 0
  
  // Точное совпадение в заголовке
  if (textLower.includes(query)) {
    score += 10
  }
  
  // Совпадение отдельных слов
  queryWords.forEach(word => {
    if (textLower.includes(word)) {
      score += 1
    }
  })
  
  // Бонус за совпадение в начале
  if (textLower.startsWith(query)) {
    score += 5
  }
  
  return score
}
