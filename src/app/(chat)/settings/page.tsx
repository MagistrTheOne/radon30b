"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Zap,
  Crown,
  Save,
  RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      chat: true,
      updates: true
    },
    privacy: {
      dataCollection: false,
      analytics: true,
      cookies: true
    },
    appearance: {
      theme: 'dark',
      fontSize: 'medium',
      animations: true
    },
    ai: {
      model: 'radon-30b',
      temperature: 0.7,
      maxTokens: 2048,
      streaming: true
    }
  })

  const handleSave = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка сохранения настроек')
      }

      toast.success('Настройки сохранены')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error(error instanceof Error ? error.message : 'Ошибка сохранения настроек')
    }
  }

  const handleReset = () => {
    setSettings({
      theme: 'dark',
      language: 'ru',
      notifications: {
        email: true,
        push: true,
        sound: true
      },
      privacy: {
        profileVisibility: 'private',
        dataSharing: false
      },
      ai: {
        personality: 'helpful',
        maxTokens: 2048,
        streaming: true
      }
    })
    toast.info('Настройки сброшены к значениям по умолчанию')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Настройки
          </h1>
          <p className="text-muted-foreground mt-2">
            Управляйте настройками вашего аккаунта и приложения
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Сбросить
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Уведомления
            </CardTitle>
            <CardDescription>
              Настройте, какие уведомления вы хотите получать
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email уведомления</Label>
                <p className="text-sm text-muted-foreground">
                  Получать уведомления на email
                </p>
              </div>
              <Switch 
                checked={settings.notifications.email}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: checked }
                  }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push уведомления</Label>
                <p className="text-sm text-muted-foreground">
                  Получать push уведомления в браузере
                </p>
              </div>
              <Switch 
                checked={settings.notifications.push}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, push: checked }
                  }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Уведомления о чатах</Label>
                <p className="text-sm text-muted-foreground">
                  Уведомления о новых сообщениях
                </p>
              </div>
              <Switch 
                checked={settings.notifications.chat}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, chat: checked }
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Конфиденциальность
            </CardTitle>
            <CardDescription>
              Управляйте сбором и использованием ваших данных
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Сбор данных для улучшения</Label>
                <p className="text-sm text-muted-foreground">
                  Разрешить сбор анонимных данных для улучшения сервиса
                </p>
              </div>
              <Switch 
                checked={settings.privacy.dataCollection}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, dataCollection: checked }
                  }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Аналитика</Label>
                <p className="text-sm text-muted-foreground">
                  Отслеживание использования для аналитики
                </p>
              </div>
              <Switch 
                checked={settings.privacy.analytics}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, analytics: checked }
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Внешний вид
            </CardTitle>
            <CardDescription>
              Настройте внешний вид интерфейса
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Анимации</Label>
                <p className="text-sm text-muted-foreground">
                  Включить плавные анимации и переходы
                </p>
              </div>
              <Switch 
                checked={settings.appearance.animations}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, animations: checked }
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Настройки AI
            </CardTitle>
            <CardDescription>
              Настройте поведение Radon AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Модель AI</Label>
                <p className="text-sm text-muted-foreground">
                  Radon AI 30B параметров
                </p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Radon 30B
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Стриминг ответов</Label>
                <p className="text-sm text-muted-foreground">
                  Показывать ответы по мере генерации
                </p>
              </div>
              <Switch 
                checked={settings.ai.streaming}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    ai: { ...prev.ai, streaming: checked }
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Информация об аккаунте
            </CardTitle>
            <CardDescription>
              Основная информация о вашем аккаунте
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Подписка</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Free
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Дата регистрации</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date().toLocaleDateString('ru-RU')}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Использование сегодня</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  3 из 10 запросов
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Всего чатов</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  12 чатов
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
