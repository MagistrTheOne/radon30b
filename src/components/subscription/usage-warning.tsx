"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  Zap, 
  ArrowRight,
  X
} from 'lucide-react'

interface UsageWarningProps {
  usagePercent: number
  limit: number
  onUpgrade: () => void
  onDismiss?: () => void
}

export function UsageWarning({ 
  usagePercent, 
  limit, 
  onUpgrade,
  onDismiss 
}: UsageWarningProps) {
  const getWarningLevel = () => {
    if (usagePercent >= 90) return 'critical'
    if (usagePercent >= 70) return 'warning'
    return 'info'
  }

  const getWarningColor = () => {
    const level = getWarningLevel()
    switch (level) {
      case 'critical':
        return 'border-red-500 bg-red-500/10'
      case 'warning':
        return 'border-yellow-500 bg-yellow-500/10'
      default:
        return 'border-blue-500 bg-blue-500/10'
    }
  }

  const getWarningText = () => {
    const level = getWarningLevel()
    switch (level) {
      case 'critical':
        return 'Критический уровень использования'
      case 'warning':
        return 'Высокий уровень использования'
      default:
        return 'Уровень использования'
    }
  }

  const getWarningMessage = () => {
    const level = getWarningLevel()
    switch (level) {
      case 'critical':
        return `Вы использовали ${Math.round(usagePercent)}% от дневного лимита. Обновите план для продолжения работы.`
      case 'warning':
        return `Вы использовали ${Math.round(usagePercent)}% от дневного лимита. Рекомендуем обновить план.`
      default:
        return `Вы использовали ${Math.round(usagePercent)}% от дневного лимита.`
    }
  }

  return (
    <div className={`p-4 border rounded-lg ${getWarningColor()} mb-4`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{getWarningText()}</h4>
            <Badge variant="secondary">
              {Math.round(usagePercent)}%
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            {getWarningMessage()}
          </p>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={onUpgrade}
              className="flex items-center gap-1"
            >
              <Zap className="w-4 h-4" />
              Обновить план
              <ArrowRight className="w-3 h-3" />
            </Button>
            
            {onDismiss && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onDismiss}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
