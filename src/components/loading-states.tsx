import { Loader2, Bot } from 'lucide-react'

interface LoadingIndicatorProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingIndicator({ text = 'Загрузка...', size = 'md' }: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className="flex items-center gap-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-muted-foreground`} />
      <span className="text-muted-foreground">{text}</span>
    </div>
  )
}

export function MessageListSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        <Bot className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="bg-muted p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-muted-foreground">Radon AI печатает...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <Bot className="w-6 h-6 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Ошибка</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Попробовать снова
        </button>
      )}
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Bot className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Добро пожаловать в Radon AI</h3>
      <p className="text-muted-foreground max-w-md">
        Начните разговор, задав вопрос или загрузив изображение. 
        Radon AI готов помочь вам с любыми задачами!
      </p>
    </div>
  )
}