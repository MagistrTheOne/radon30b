"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Message, MessageEdit } from '@/types/chat'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface MessageHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  message: Message | null
}

export function MessageHistoryDialog({ 
  open, 
  onOpenChange, 
  message 
}: MessageHistoryDialogProps) {
  // TODO: Загружать реальную историю изменений с сервера
  const mockEdits: MessageEdit[] = [
    {
      id: '1',
      messageId: message?.id || '',
      previousContent: 'Первоначальная версия сообщения',
      editedAt: new Date(Date.now() - 3600000) // 1 час назад
    },
    {
      id: '2', 
      messageId: message?.id || '',
      previousContent: 'Вторая версия с небольшими изменениями',
      editedAt: new Date(Date.now() - 1800000) // 30 минут назад
    }
  ]

  if (!message) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>История изменений</DialogTitle>
          <DialogDescription>
            История редактирования сообщения
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Текущая версия */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Текущая версия</Badge>
              <span className="text-sm text-muted-foreground">
                {format(new Date(), 'dd.MM.yyyy HH:mm', { locale: ru })}
              </span>
            </div>
            <div className="text-sm whitespace-pre-wrap">
              {message.content}
            </div>
          </div>

          {/* История изменений */}
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-4">
              {mockEdits.map((edit, index) => (
                <div key={edit.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">
                      Версия {mockEdits.length - index}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {format(edit.editedAt, 'dd.MM.yyyy HH:mm', { locale: ru })}
                    </span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {edit.previousContent}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
