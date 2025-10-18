"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Zap,
  MessageSquare,
  Code,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { subscriptionApi, UsageStatsResponse } from '@/lib/subscription-api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function AnalyticsPage() {
  const [usageStats, setUsageStats] = useState<UsageStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')

  useEffect(() => {
    loadUsageStats()
  }, [period])

  const loadUsageStats = async () => {
    try {
      setLoading(true)
      const response = await subscriptionApi.getUsageStats(period)
      setUsageStats(response.data)
    } catch (error) {
      console.error('Error loading usage stats:', error)
      toast.error('Ошибка загрузки аналитики')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getPeriodLabel = () => {
    switch (period) {
      case '7d': return '7 дней'
      case '30d': return '30 дней'
      case '90d': return '90 дней'
      default: return '30 дней'
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Аналитика использования
          </h1>
          <p className="text-muted-foreground mt-2">
            Детальная статистика вашего использования Radon AI
          </p>
        </div>
        
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((p) => (
            <Button
              key={p}
              variant={period === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {p === '7d' ? '7 дней' : p === '30d' ? '30 дней' : '90 дней'}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usageStats?.totalMessages || 0}</p>
                <p className="text-sm text-muted-foreground">Сообщений</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usageStats?.totalRequests || 0}</p>
                <p className="text-sm text-muted-foreground">Запросов</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usageStats?.totalApiCalls || 0}</p>
                <p className="text-sm text-muted-foreground">API вызовов</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {usageStats?.dailyBreakdown && usageStats.dailyBreakdown.length > 0 
                    ? Math.round(usageStats.totalRequests / usageStats.dailyBreakdown.length)
                    : 0
                  }
                </p>
                <p className="text-sm text-muted-foreground">Среднее в день</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Использование по дням</CardTitle>
            <CardDescription>
              Количество запросов за последние {getPeriodLabel()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageStats?.dailyBreakdown || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value) => [value, 'Запросов']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Usage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Распределение использования</CardTitle>
            <CardDescription>
              Разбивка по типам запросов
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Сообщения', value: usageStats?.totalMessages || 0 },
                  { name: 'API вызовы', value: usageStats?.totalApiCalls || 0 },
                  { name: 'Всего запросов', value: usageStats?.totalRequests || 0 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Пиковое использование</CardTitle>
            <CardDescription>
              Самые активные дни
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usageStats?.dailyBreakdown
                .sort((a, b) => b.requests - a.requests)
                .slice(0, 5)
                .map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{formatDate(day.date)}</p>
                        <p className="text-sm text-muted-foreground">
                          {day.requests} запросов
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{day.requests}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Тренды использования</CardTitle>
            <CardDescription>
              Анализ активности
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">Среднее в день</p>
                    <p className="text-sm text-muted-foreground">
                      За последние {getPeriodLabel()}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold">
                  {(usageStats?.dailyBreakdown && usageStats?.totalRequests != null && usageStats.dailyBreakdown.length > 0)
                    ? Math.round(usageStats.totalRequests / usageStats.dailyBreakdown.length)
                    : 0
                  }
                </p>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Активных дней</p>
                    <p className="text-sm text-muted-foreground">
                      Дни с активностью
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold">
                  {usageStats?.dailyBreakdown.filter(day => day.requests > 0).length || 0}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Пиковый день</p>
                    <p className="text-sm text-muted-foreground">
                      Максимум запросов
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold">
                  {Math.max(...(usageStats?.dailyBreakdown.map(day => day.requests) || [0]))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
