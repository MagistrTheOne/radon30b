"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Image, 
  Code, 
  Mic, 
  Languages, 
  BarChart3,
  Sparkles
} from 'lucide-react'
import { useChatContext } from '@/contexts/ChatContext'

interface QuickAction {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  prompt: string
  category: 'text' | 'image' | 'code' | 'audio' | 'translate' | 'analyze'
}

const quickActions: QuickAction[] = [
  {
    id: 'text',
    icon: <FileText className="w-5 h-5" />,
    title: 'Текст',
    description: 'Создать контент',
    prompt: 'Напиши интересную статью о...',
    category: 'text'
  },
  {
    id: 'image',
    icon: <Image className="w-5 h-5" />,
    title: 'Изображение',
    description: 'Анализ картинок',
    prompt: 'Проанализируй это изображение и опиши что видишь',
    category: 'image'
  },
  {
    id: 'code',
    icon: <Code className="w-5 h-5" />,
    title: 'Код',
    description: 'Программирование',
    prompt: 'Напиши код на Python для...',
    category: 'code'
  },
  {
    id: 'audio',
    icon: <Mic className="w-5 h-5" />,
    title: 'Аудио',
    description: 'Голосовые сообщения',
    prompt: 'Запиши голосовое сообщение',
    category: 'audio'
  },
  {
    id: 'translate',
    icon: <Languages className="w-5 h-5" />,
    title: 'Перевод',
    description: 'Перевести текст',
    prompt: 'Переведи этот текст на английский:',
    category: 'translate'
  },
  {
    id: 'analyze',
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Анализ',
    description: 'Анализ данных',
    prompt: 'Проанализируй эти данные и сделай выводы',
    category: 'analyze'
  }
]

export function QuickActions() {
  const { createChat } = useChatContext()
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)

  const handleActionClick = async (action: QuickAction) => {
    // Создаем новый чат с промптом
    await createChat(`Новый чат - ${action.title}`)
    
    // TODO: Вставить промпт в поле ввода
    // Это потребует интеграции с MessageInput компонентом
  }

  // Адаптивное количество кнопок: 3 на мобиле, 6 на десктопе
  const mobileActions = quickActions.slice(0, 3)
  const desktopActions = quickActions

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          Быстрые действия
        </h4>
        <p className="text-xs text-muted-foreground">
          Выберите тип задачи для начала работы
        </p>
      </div>

      {/* Mobile: 3 actions */}
      <div className="grid grid-cols-3 gap-3 sm:hidden">
        {mobileActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.7 + index * 0.1 }}
          >
            <Card 
              className="p-3 cursor-pointer hover:bg-accent/50 transition-colors border-border/50"
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={() => handleActionClick(action)}
            >
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {action.icon}
                </div>
                <p className="text-xs font-medium">{action.title}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Desktop: 6 actions */}
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {desktopActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.7 + index * 0.1 }}
          >
            <Card 
              className="p-4 cursor-pointer hover:bg-accent/50 transition-colors border-border/50 group"
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={() => handleActionClick(action)}
            >
              <div className="text-center">
                <motion.div 
                  className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center text-primary"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {action.icon}
                </motion.div>
                <p className="text-sm font-medium mb-1">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Sparkle decoration */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.2 }}
      >
        <Sparkles className="w-4 h-4 text-primary/50" />
      </motion.div>
    </div>
  )
}
