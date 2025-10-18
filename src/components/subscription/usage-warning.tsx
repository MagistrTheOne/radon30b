"use client"

import { motion } from 'framer-motion'
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
  const level =
    usagePercent >= 90 ? 'critical' :
    usagePercent >= 70 ? 'warning' : 'info'

  const colorMap = {
    critical: 'border-red-500 bg-red-500/10',
    warning: 'border-yellow-500 bg-yellow-500/10',
    info: 'border-blue-500 bg-blue-500/10'
  }

  const accentMap = {
    critical: 'text-red-500',
    warning: 'text-yellow-600',
    info: 'text-blue-500'
  }

  const titleMap = {
    critical: 'Критический уровень использования',
    warning: 'Высокий уровень использования',
    info: 'Уровень использования'
  }

  const messageMap = {
    critical: `Вы использовали ${Math.round(usagePercent)}% дневного лимита. Radon скоро приостановит обработку — самое время перейти на Pro.`,
    warning: `Вы уже использовали ${Math.round(usagePercent)}% дневного лимита. Рекомендуем обновить план, чтобы не замедляться.`,
    info: `Использовано ${Math.round(usagePercent)}% лимита. Всё стабильно, но следите за расходом.`
  }

  return (
    <motion.div
        key="usage-warning"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className={`p-4 border rounded-lg ${colorMap[level]} mb-4 relative overflow-hidden`}
      >
        {/* background progress bar */}
        <div
          className={`absolute bottom-0 left-0 h-0.5 ${accentMap[level]} transition-all duration-500`}
          style={{ width: `${usagePercent}%` }}
        />

        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 ${accentMap[level]} flex-shrink-0 mt-0.5`} />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{titleMap[level]}</h4>
              <Badge variant="secondary">
                {Math.round(usagePercent)}%
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {messageMap[level]}
            </p>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={onUpgrade}
                className="flex items-center gap-1 transition-transform hover:translate-y-[-1px]"
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
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
  )
}
