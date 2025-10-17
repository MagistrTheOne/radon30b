"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign,
  Activity,
  Zap,
  Crown
} from 'lucide-react'

export default function AdminDashboard() {
  // Mock data for demonstration
  const stats = {
    totalUsers: 1247,
    totalTeams: 89,
    totalRevenue: 45680,
    activeSubscriptions: 234,
    dailyActiveUsers: 156,
    monthlyGrowth: 12.5
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
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Всего пользователей</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalTeams}</p>
                <p className="text-sm text-muted-foreground">Команд</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Общий доход</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.dailyActiveUsers}</p>
                <p className="text-sm text-muted-foreground">Активных сегодня</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
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
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
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
