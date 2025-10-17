"use client"

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

// Скелетон для списка чатов
export function ChatListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Скелетон для сообщений
export function MessageSkeleton() {
  return (
    <div className="flex gap-4">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  )
}

// Скелетон для списка сообщений
export function MessageListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <MessageSkeleton key={i} />
      ))}
    </div>
  )
}

// Индикатор загрузки с текстом
export function LoadingIndicator({ text = "Загрузка..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 p-4">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}

// Скелетон для карточек настроек
export function SettingsCardSkeleton() {
  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// Скелетон для профиля
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Скелетон для тарифных планов
export function PricingCardSkeleton() {
  return (
    <Card className="h-full">
      <div className="p-6 space-y-4">
        <div className="text-center space-y-2">
          <Skeleton className="h-6 w-20 mx-auto" />
          <Skeleton className="h-8 w-24 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
        
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
        
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  )
}

// Компонент для отображения пустого состояния
export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: { 
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 mx-auto mb-4 text-muted-foreground">
        <Icon className="w-full h-full" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
        {description}
      </p>
      {action}
    </div>
  )
}
