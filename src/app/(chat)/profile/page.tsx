"use client"

import { useReducer, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  User, Mail, Calendar, Shield, Edit3, Save, Camera,
  Globe, Key, Trash2, AlertTriangle, Loader2
} from 'lucide-react'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  bio: string
  location: string
  website: string
  timezone: string
  avatar: string
}

export default function ProfilePage() {
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState<'save' | 'delete' | null>(null)

  const initialData: ProfileData = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    bio: 'Пользователь Radon AI',
    location: 'Краснодар, Россия',
    website: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    avatar: user?.imageUrl || ''
  }

  const [profileData, updateProfile] = useReducer(
    (state: ProfileData, update: Partial<ProfileData>) => ({ ...state, ...update }),
    initialData
  )

  const handleSave = async () => {
    setLoading('save')
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${profileData.firstName} ${profileData.lastName}`.trim(),
          imageUrl: profileData.avatar
        })
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Ошибка сохранения')
      toast.success('Профиль обновлён')
      setIsEditing(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка сохранения профиля')
    } finally {
      setLoading(null)
    }
  }

  const handleCancel = () => {
    updateProfile(initialData)
    setIsEditing(false)
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Удалить аккаунт безвозвратно?')) return
    setLoading('delete')
    try {
      const res = await fetch('/api/profile', { method: 'DELETE' })
      if (!res.ok) throw new Error((await res.json()).error || 'Ошибка удаления')
      toast.success('Аккаунт удалён')
      window.location.href = '/'
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка удаления аккаунта')
    } finally {
      setLoading(null)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    updateProfile({ avatar: url })
    toast('Фото обновлено (локально, не загружено)')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            <User className="w-7 h-7 text-primary" />
            Профиль
          </h1>
          <p className="text-muted-foreground mt-1">
            Управляйте информацией о вашем профиле
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={handleCancel} disabled={loading !== null}>
                Отмена
              </Button>
              <Button onClick={handleSave} disabled={loading !== null}>
                {loading === 'save'
                  ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  : <Save className="w-4 h-4 mr-2" />}
                Сохранить
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Редактировать
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <motion.div
          layout
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>Контактные и личные данные</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Имя"
                  id="firstName"
                  value={profileData.firstName}
                  disabled={!isEditing}
                  onChange={(v) => updateProfile({ firstName: v })}
                />
                <Field
                  label="Фамилия"
                  id="lastName"
                  value={profileData.lastName}
                  disabled={!isEditing}
                  onChange={(v) => updateProfile({ lastName: v })}
                />
              </div>

              <Field
                label="Email"
                id="email"
                value={profileData.email}
                disabled
                hint="Email нельзя изменить. Обратитесь в поддержку."
              />

              <Field
                label="О себе"
                id="bio"
                value={profileData.bio}
                disabled={!isEditing}
                onChange={(v) => updateProfile({ bio: v })}
                placeholder="Расскажите о себе..."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Местоположение"
                  id="location"
                  value={profileData.location}
                  disabled={!isEditing}
                  onChange={(v) => updateProfile({ location: v })}
                />
                <Field
                  label="Веб-сайт"
                  id="website"
                  value={profileData.website}
                  disabled={!isEditing}
                  onChange={(v) => updateProfile({ website: v })}
                  placeholder="https://example.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Настройки аккаунта
              </CardTitle>
              <CardDescription>Безопасность и управление</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingsRow
                icon={<Key className="w-5 h-5 text-muted-foreground" />}
                title="Пароль"
                subtitle="Последнее изменение: 2 недели назад"
                action={<Button variant="outline" size="sm">Изменить</Button>}
              />
              <SettingsRow
                icon={<Shield className="w-5 h-5 text-muted-foreground" />}
                title="Двухфакторная аутентификация"
                subtitle="Дополнительная защита"
                action={<Badge variant="secondary">Не включена</Badge>}
              />
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Опасная зона
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-destructive/40 rounded-lg">
                <div>
                  <p className="font-medium text-destructive">Удалить аккаунт</p>
                  <p className="text-sm text-muted-foreground">
                    Навсегда удалить ваш аккаунт и все данные
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                  disabled={loading !== null}
                >
                  {loading === 'delete'
                    ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    : <Trash2 className="w-4 h-4 mr-2" />}
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader><CardTitle>Аватар</CardTitle></CardHeader>
            <CardContent className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 ring-2 ring-primary/10">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="text-lg">
                  {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                <Camera className="w-4 h-4 mr-2" />
                Изменить фото
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Аккаунт</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <InfoRow icon={<Calendar />} title="Дата регистрации" value={new Date().toLocaleDateString('ru-RU')} />
              <Separator />
              <InfoRow icon={<Mail />} title="Email подтвержден" value={user?.emailAddresses[0]?.verification?.status === 'verified' ? 'Да' : 'Нет'} />
              <Separator />
              <InfoRow icon={<Globe />} title="Часовой пояс" value={profileData.timezone} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function Field({ label, id, value, disabled, onChange, placeholder, hint }: {
  label: string; id: string; value: string; disabled?: boolean;
  onChange?: (v: string) => void; placeholder?: string; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={disabled ? 'bg-muted/60' : ''}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

interface SettingsRowProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  action: React.ReactNode
}

function SettingsRow({ icon, title, subtitle, action }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  )
}

interface InfoRowProps {
  icon: React.ReactNode
  title: string
  value: string | number
}

function InfoRow({ icon, title, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground">{value}</p>
      </div>
    </div>
  )
}
