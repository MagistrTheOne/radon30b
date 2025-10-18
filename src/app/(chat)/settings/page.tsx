"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card'
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
  Database,
  Zap,
  Crown,
  Save,
  RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'

type SettingsState = {
  notifications: {
    email: boolean
    push: boolean
    chat: boolean
    updates: boolean
  }
  privacy: {
    dataCollection: boolean
    analytics: boolean
    cookies: boolean
  }
  appearance: {
    theme: string
    fontSize: string
    animations: boolean
  }
  ai: {
    model: string
    temperature: number
    maxTokens: number
    streaming: boolean
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: { email: true, push: false, chat: true, updates: true },
    privacy: { dataCollection: false, analytics: true, cookies: true },
    appearance: { theme: 'dark', fontSize: 'medium', animations: true },
    ai: { model: 'radon-30b', temperature: 0.7, maxTokens: 2048, streaming: true }
  })

  const handleSave = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Ошибка сохранения')
      toast.success('Настройки сохранены')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка сохранения настроек')
    }
  }

  const handleReset = () => {
    setSettings({
      notifications: { email: true, push: true, chat: true, updates: true },
      privacy: { dataCollection: false, analytics: false, cookies: false },
      appearance: { theme: 'dark', fontSize: 'medium', animations: true },
      ai: { model: 'radon-30b', temperature: 0.7, maxTokens: 2048, streaming: true }
    })
    toast.info('Настройки сброшены к значениям по умолчанию')
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            <Settings className="w-7 h-7 text-primary" />
            Настройки
          </h1>
          <p className="text-muted-foreground mt-1">
            Управляйте настройками аккаунта и интерфейса Radon AI
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" /> Сбросить
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Сохранить
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <GlassCard
          title="Уведомления"
          icon={<Bell className="w-5 h-5 text-primary" />}
          description="Настройте, какие уведомления вы хотите получать"
        >
          <SettingSwitch
            label="Email уведомления"
            note="Получать уведомления на email"
            value={settings.notifications.email}
            onChange={(v) =>
              setSettings((p) => ({
                ...p,
                notifications: { ...p.notifications, email: v }
              }))
            }
          />
          <Separator />
          <SettingSwitch
            label="Push уведомления"
            note="Получать уведомления в браузере"
            value={settings.notifications.push}
            onChange={(v) =>
              setSettings((p) => ({
                ...p,
                notifications: { ...p.notifications, push: v }
              }))
            }
          />
          <Separator />
          <SettingSwitch
            label="Уведомления о чатах"
            note="О новых сообщениях"
            value={settings.notifications.chat}
            onChange={(v) =>
              setSettings((p) => ({
                ...p,
                notifications: { ...p.notifications, chat: v }
              }))
            }
          />
        </GlassCard>

        <GlassCard
          title="Конфиденциальность"
          icon={<Shield className="w-5 h-5 text-primary" />}
          description="Управляйте сбором и использованием данных"
        >
          <SettingSwitch
            label="Сбор данных для улучшения"
            note="Анонимная телеметрия"
            value={settings.privacy.dataCollection}
            onChange={(v) =>
              setSettings((p) => ({
                ...p,
                privacy: { ...p.privacy, dataCollection: v }
              }))
            }
          />
          <Separator />
          <SettingSwitch
            label="Аналитика"
            note="Отслеживание использования"
            value={settings.privacy.analytics}
            onChange={(v) =>
              setSettings((p) => ({
                ...p,
                privacy: { ...p.privacy, analytics: v }
              }))
            }
          />
        </GlassCard>

        <GlassCard
          title="Внешний вид"
          icon={<Palette className="w-5 h-5 text-primary" />}
          description="Настройте тему и анимации"
        >
          <SettingSwitch
            label="Анимации"
            note="Плавные переходы интерфейса"
            value={settings.appearance.animations}
            onChange={(v) =>
              setSettings((p) => ({
                ...p,
                appearance: { ...p.appearance, animations: v }
              }))
            }
          />
        </GlassCard>

        <GlassCard
          title="AI-параметры"
          icon={<Zap className="w-5 h-5 text-primary" />}
          description="Настройте поведение Radon AI"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Модель AI</Label>
              <p className="text-sm text-muted-foreground">Radon AI 30B параметров</p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Crown className="w-3 h-3" /> Radon 30B
            </Badge>
          </div>
          <Separator />
          <SettingSwitch
            label="Стриминг ответов"
            note="Показывать ответы в реальном времени"
            value={settings.ai.streaming}
            onChange={(v) =>
              setSettings((p) => ({
                ...p,
                ai: { ...p.ai, streaming: v }
              }))
            }
          />
        </GlassCard>

        <GlassCard
          title="Аккаунт"
          icon={<Database className="w-5 h-5 text-primary" />}
          description="Информация об использовании и подписке"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock label="Подписка">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="w-3 h-3" /> Free
              </Badge>
            </InfoBlock>
            <InfoBlock label="Дата регистрации">
              {new Date().toLocaleDateString('ru-RU')}
            </InfoBlock>
            <InfoBlock label="Использование сегодня">3 из 10 запросов</InfoBlock>
            <InfoBlock label="Всего чатов">12 чатов</InfoBlock>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  )
}

/* --- вспомогательные компоненты --- */

interface GlassCardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
}

function GlassCard({ title, description, icon, children }: GlassCardProps) {
  return (
    <Card className="bg-muted/30 backdrop-blur-md hover:bg-muted/40 transition border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

interface SettingSwitchProps {
  label: string
  note?: string
  value: boolean
  onChange: (v: boolean) => void
}

function SettingSwitch({ label, note, value, onChange }: SettingSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        {note && <p className="text-sm text-muted-foreground">{note}</p>}
      </div>
      <Switch checked={value} onCheckedChange={(checked: boolean) => onChange(checked)} />
    </div>
  )
}

interface InfoBlockProps {
  label: string
  children: React.ReactNode
}

function InfoBlock({ label, children }: InfoBlockProps) {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <p className="text-sm text-muted-foreground mt-1">{children}</p>
    </div>
  )
}
