"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Keyboard, 
  Send, 
  Image, 
  Mic, 
  HelpCircle,
  Command,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react'

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Shortcut {
  keys: string[]
  description: string
  icon: React.ReactNode
  category: 'messaging' | 'navigation' | 'general'
}

const shortcuts: Shortcut[] = [
  {
    keys: ['Enter'],
    description: 'Отправить сообщение',
    icon: <Send className="w-4 h-4" />,
    category: 'messaging'
  },
  {
    keys: ['Shift', 'Enter'],
    description: 'Новая строка',
    icon: <ArrowDown className="w-4 h-4" />,
    category: 'messaging'
  },
  {
    keys: ['Ctrl', 'K'],
    description: 'Быстрая загрузка изображения',
    icon: <Image className="w-4 h-4" />,
    category: 'messaging'
  },
  {
    keys: ['Space'],
    description: 'Запись голосового сообщения',
    icon: <Mic className="w-4 h-4" />,
    category: 'messaging'
  },
  {
    keys: ['↑', '↓'],
    description: 'Навигация по истории сообщений',
    icon: <ArrowUp className="w-4 h-4" />,
    category: 'navigation'
  },
  {
    keys: ['/'],
    description: 'Команды (например /help)',
    icon: <Command className="w-4 h-4" />,
    category: 'navigation'
  },
  {
    keys: ['Esc'],
    description: 'Закрыть диалоги',
    icon: <X className="w-4 h-4" />,
    category: 'general'
  }
]

const categoryLabels = {
  messaging: 'Сообщения',
  navigation: 'Навигация',
  general: 'Общие'
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, Shortcut[]>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Горячие клавиши
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>
              
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                        {shortcut.icon}
                      </div>
                      <span className="text-sm">{shortcut.description}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs font-mono">
                            {key}
                          </Badge>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground text-xs">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {category !== 'general' && <Separator className="mt-4" />}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Совет:</p>
              <p>
                Введите <code className="bg-muted px-1 rounded">/help</code> в чате 
                для быстрого доступа к этой справке.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
