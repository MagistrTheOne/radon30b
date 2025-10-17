"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Brain, 
  Lightbulb, 
  Wrench, 
  Heart,
  Sparkles,
  Code,
  MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type PersonalityType = 'helpful' | 'creative' | 'technical'

interface PersonalitySelectorProps {
  currentPersonality: PersonalityType
  onPersonalityChange: (personality: PersonalityType) => void
  className?: string
}

const personalities = [
  {
    id: 'helpful' as PersonalityType,
    name: 'Помощник',
    description: 'Дружелюбный и отзывчивый помощник',
    icon: Heart,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    id: 'creative' as PersonalityType,
    name: 'Креативщик',
    description: 'Творческий и вдохновляющий',
    icon: Sparkles,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  {
    id: 'technical' as PersonalityType,
    name: 'Технарь',
    description: 'Точный и технически подкованный',
    icon: Code,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  }
]

export function PersonalitySelector({ 
  currentPersonality, 
  onPersonalityChange, 
  className 
}: PersonalitySelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const currentPersonalityData = personalities.find(p => p.id === currentPersonality)

  return (
    <div className={cn("space-y-2", className)}>
      {/* Компактный селектор */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          {currentPersonalityData && (
            <>
              <currentPersonalityData.icon className={cn("w-4 h-4", currentPersonalityData.color)} />
              <span className="text-sm">{currentPersonalityData.name}</span>
            </>
          )}
        </Button>
        
        <Badge variant="secondary" className="text-xs">
          Radon AI v2.0.0
        </Badge>
      </div>

      {/* Развернутый селектор */}
      {isExpanded && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Режим общения Radon AI</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {personalities.map((personality) => {
              const Icon = personality.icon
              const isSelected = personality.id === currentPersonality
              
              return (
                <Card
                  key={personality.id}
                  className={cn(
                    "p-3 cursor-pointer transition-all hover:shadow-md",
                    personality.bgColor,
                    personality.borderColor,
                    isSelected && "ring-2 ring-primary"
                  )}
                  onClick={() => {
                    onPersonalityChange(personality.id)
                    setIsExpanded(false)
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={cn("w-5 h-5", personality.color)} />
                    <span className="font-medium text-sm">{personality.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {personality.description}
                  </p>
                </Card>
              )
            })}
          </div>

          <div className="text-xs text-muted-foreground">
            <MessageSquare className="w-3 h-3 inline mr-1" />
            Режим влияет на стиль ответов и доступные функции
          </div>
        </Card>
      )}

      {/* Альтернативный селектор для мобильных */}
      <div className="block sm:hidden">
        <Select value={currentPersonality} onValueChange={onPersonalityChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите режим" />
          </SelectTrigger>
          <SelectContent>
            {personalities.map((personality) => {
              const Icon = personality.icon
              return (
                <SelectItem key={personality.id} value={personality.id}>
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-4 h-4", personality.color)} />
                    <span>{personality.name}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
