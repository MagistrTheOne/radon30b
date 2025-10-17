"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Crown, 
  Zap, 
  Building2, 
  Check, 
  ArrowRight,
  Loader2
} from 'lucide-react'
import { subscriptionApi } from '@/lib/subscription-api'
import { toast } from 'sonner'

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: 'rate_limit_reached' | 'manual'
  currentTier: string
  recommendedTier: string
  features: string[]
}

export function UpgradeModal({ 
  open, 
  onOpenChange, 
  trigger,
  currentTier,
  recommendedTier,
  features 
}: UpgradeModalProps) {
  const [upgrading, setUpgrading] = useState(false)

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'pro':
        return {
          name: 'Pro',
          price: '$19',
          period: 'месяц',
          icon: Crown,
          color: 'text-blue-500'
        }
      case 'team':
        return {
          name: 'Team',
          price: '$99',
          period: 'месяц',
          icon: Building2,
          color: 'text-purple-500'
        }
      default:
        return {
          name: 'Free',
          price: '$0',
          period: 'навсегда',
          icon: Zap,
          color: 'text-gray-500'
        }
    }
  }

  const currentTierInfo = getTierInfo(currentTier)
  const recommendedTierInfo = getTierInfo(recommendedTier)

  const handleUpgrade = async () => {
    try {
      setUpgrading(true)
      const response = await subscriptionApi.createCheckoutSession(recommendedTier)
      window.location.href = response.data.checkoutUrl
    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast.error('Ошибка создания сессии оплаты')
    } finally {
      setUpgrading(false)
    }
  }

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'rate_limit_reached':
        return 'Вы достигли лимита запросов для вашего текущего плана'
      case 'manual':
        return 'Обновите план для получения дополнительных возможностей'
      default:
        return 'Обновите план для получения дополнительных возможностей'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Обновление плана
          </DialogTitle>
          <DialogDescription>
            {getTriggerMessage()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current vs Recommended */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current Plan */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <currentTierInfo.icon className={`w-5 h-5 ${currentTierInfo.color}`} />
                <span className="font-medium">{currentTierInfo.name}</span>
              </div>
              <p className="text-2xl font-bold">{currentTierInfo.price}</p>
              <p className="text-sm text-muted-foreground">/{currentTierInfo.period}</p>
            </div>

            {/* Recommended Plan */}
            <div className="p-4 border border-primary rounded-lg bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <recommendedTierInfo.icon className={`w-5 h-5 ${recommendedTierInfo.color}`} />
                <span className="font-medium">{recommendedTierInfo.name}</span>
                <Badge>Рекомендуется</Badge>
              </div>
              <p className="text-2xl font-bold">{recommendedTierInfo.price}</p>
              <p className="text-sm text-muted-foreground">/{recommendedTierInfo.period}</p>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-medium mb-3">Что вы получите:</h4>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Преимущества обновления:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Безлимитные запросы</li>
              <li>• Приоритетная обработка</li>
              <li>• Расширенная история чатов</li>
              <li>• Приоритетная поддержка</li>
              <li>• API доступ</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Позже
            </Button>
            <Button 
              onClick={handleUpgrade}
              disabled={upgrading}
              className="flex-1"
            >
              {upgrading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Обработка...
                </>
              ) : (
                <>
                  Обновить до {recommendedTierInfo.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
