"use client"

import { useState, useEffect } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card'
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

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
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary" />
            Аналитика использования
          </h1>
          <p className="text-muted-foreground mt-1">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<MessageSquare className="w-5 h-5 text-blue-500" />}
          label="Сообщений"
          value={usageStats?.totalMessages || 0}
          bg="bg-blue-500/10"
        />
        <MetricCard
          icon={<Zap className="w-5 h-5 text-green-500" />}
          label="Запросов"
          value={usageStats?.totalRequests || 0}
          bg="bg-green-500/10"
        />
        <MetricCard
          icon={<Code className="w-5 h-5 text-purple-500" />}
          label="API вызовов"
          value={usageStats?.totalApiCalls || 0}
          bg="bg-purple-500/10"
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
          label="Среднее в день"
          value={
            usageStats?.dailyBreakdown?.length
              ? Math.round(usageStats.totalRequests / usageStats.dailyBreakdown.length)
              : 0
          }
          bg="bg-orange-500/10"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Usage */}
        <Card className="bg-muted/30 backdrop-blur-sm">
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
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value) => [value, 'Запросов']}
                  />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Usage Distribution */}
        <Card className="bg-muted/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Распределение использования</CardTitle>
            <CardDescription>Разбивка по типам запросов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Сообщения', value: usageStats?.totalMessages || 0 },
                  { name: 'API вызовы', value: usageStats?.totalApiCalls || 0 },
                  { name: 'Всего запросов', value: usageStats?.totalRequests || 0 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Usage */}
        <Card className="bg-muted/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Пиковое использование</CardTitle>
            <CardDescription>Самые активные дни</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usageStats?.dailyBreakdown
                ?.sort((a, b) => b.requests - a.requests)
                .slice(0, 5)
                .map((day, index) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{formatDate(day.date)}</p>
                        <p className="text-sm text-muted-foreground">{day.requests} запросов</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold">{day.requests}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Trends */}
        <Card className="bg-muted/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Тренды использования</CardTitle>
            <CardDescription>Анализ активности</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TrendRow
              icon={<TrendingUp className="w-5 h-5 text-green-500" />}
              title="Среднее в день"
              subtitle={`За последние ${getPeriodLabel()}`}
              value={
                usageStats?.dailyBreakdown?.length
                  ? Math.round(usageStats.totalRequests / usageStats.dailyBreakdown.length)
                  : 0
              }
            />
            <TrendRow
              icon={<Calendar className="w-5 h-5 text-blue-500" />}
              title="Активных дней"
              subtitle="Дни с активностью"
              value={usageStats?.dailyBreakdown.filter(d => d.requests > 0).length || 0}
            />
            <TrendRow
              icon={<Zap className="w-5 h-5 text-yellow-500" />}
              title="Пиковый день"
              subtitle="Максимум запросов"
              value={Math.max(...(usageStats?.dailyBreakdown.map(d => d.requests) || [0]))}
            />
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plan */}
      <Card className="border border-primary/20 bg-muted/30 backdrop-blur-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Ваш тариф
            </CardTitle>
            <CardDescription>
              Управляйте подпиской и лимитами Radon AI
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="mt-2 sm:mt-0 px-3 py-1 text-primary border-primary/40"
          >
            Free Plan
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-background/50">
              <p className="text-sm text-muted-foreground">Лимит запросов в месяц</p>
              <p className="text-2xl font-bold mt-1">
                {usageStats?.totalRequests || 0} / 1 000
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-background/50">
              <p className="text-sm text-muted-foreground">API-лимит</p>
              <p className="text-2xl font-bold mt-1">
                {usageStats?.totalApiCalls || 0} / 500
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              Хочешь больше мощности и скорости?
            </p>
            <Button variant="default" size="sm" className="shadow-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Обновить до Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* helper components */

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  bg: string
}

function MetricCard({ icon, label, value, bg }: MetricCardProps) {
  return (
    <Card className="bg-muted/30 backdrop-blur-sm hover:bg-muted/50 transition">
      <CardContent className="p-6 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface TrendRowProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  value: string | number
}

function TrendRow({ icon, title, subtitle, value }: TrendRowProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  )
}
