"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign,
  Activity,
  Zap,
  Crown,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface AdminStats {
  totalUsers: number
  totalTeams: number
  totalRevenue: number
  activeSubscriptions: number
  dailyActiveUsers: number
  monthlyGrowth: number
  totalMessages: number
  totalChats: number
  subscriptionBreakdown: Record<string, number>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stats')
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка загрузки статистики')
      }

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error loading admin stats:', error)
      toast.error(error instanceof Error ? error.message : 'Ошибка загрузки статистики')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Не удалось загрузить статистику</p>
      </div>
    )
  }

  const recentActivity = [
    { type: 'user_signup', user: 'john@example.com', time: '2 минуты назад' },
    { type: 'team_created', user: 'Acme Corp', time: '15 минут назад' },
    { type: 'subscription_upgrade', user: 'jane@example.com', time: '1 час назад' },
    { type: 'payment_received', user: 'TechStart Inc', time: '2 часа назад' },
  ]

  const topTeams = [
    { name: 'Acme Corporation', members: 25, plan: 'Enterprise', revenue: 2500 },
    { name: 'TechStart Inc', members: 12, plan: 'Team', revenue: 1200 },
    { name: 'Innovation Labs', members: 8, plan: 'Team', revenue: 800 },
  ]

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Обзор системы и ключевые метрики
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Всего пользователей', value: stats.totalUsers, icon: Users, color: 'blue' },
          { title: 'Команд', value: stats.totalTeams, icon: Building2, color: 'green' },
          { title: 'Общий доход', value: stats.totalRevenue, icon: DollarSign, color: 'yellow' },
          { title: 'Активных сегодня', value: stats.dailyActiveUsers, icon: Activity, color: 'purple' }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/10 flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 text-${item.color}-500`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Последняя активность
            </CardTitle>
            <CardDescription>
              События в системе за последние 24 часа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {activity.type === 'user_signup' && <Users className="w-4 h-4" />}
                      {activity.type === 'team_created' && <Building2 className="w-4 h-4" />}
                      {activity.type === 'subscription_upgrade' && <Crown className="w-4 h-4" />}
                      {activity.type === 'payment_received' && <DollarSign className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Teams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Топ команды
            </CardTitle>
            <CardDescription>
              Команды с наибольшим доходом
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topTeams.map((team, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {team.members} участников
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={team.plan === 'Enterprise' ? 'default' : 'secondary'}>
                        {team.plan}
                      </Badge>
                      <p className="text-sm font-medium mt-1">
                        ${team.revenue}/мес
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Статус системы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="font-medium">API</p>
                <p className="text-sm text-muted-foreground">Работает</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="font-medium">База данных</p>
                <p className="text-sm text-muted-foreground">Работает</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="font-medium">Stripe</p>
                <p className="text-sm text-muted-foreground">Работает</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
