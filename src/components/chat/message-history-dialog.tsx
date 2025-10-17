"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Message } from '@/types/chat'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

interface MessageHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  message: Message | null
}

export function MessageHistoryDialog({ open, onOpenChange, message }: MessageHistoryDialogProps) {
  const [editHistory, setEditHistory] = useState<{ id: string; previousContent: string; editedAt: Date }[]>([])

  useEffect(() => {
    if (message && open) {
      loadMessageHistory()
    }
  }, [message, open])

  const loadMessageHistory = async () => {
    if (!message) return

    try {
      const response = await fetch(`/api/messages/${message.id}/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Ошибка загрузки истории')
      }

      const data = await response.json()
      setEditHistory(data.editHistory || [])
    } catch (error) {
      console.error('Error loading message history:', error)
      setEditHistory([])
    }
  }

  if (!message) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>История редактирования сообщения</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Текущая версия */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default">Текущая версия</Badge>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: ru })}
              </span>
            </div>
            <p className="text-sm">{message.content}</p>
          </div>

          {/* История редактирования */}
          <ScrollArea className="max-h-96">
            <div className="space-y-3">
              {editHistory.map((edit, index) => (
                <div key={edit.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Версия {editHistory.length - index}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(edit.editedAt), { addSuffix: true, locale: ru })}
                    </span>
                  </div>
                  <p className="text-sm">{edit.previousContent}</p>
                </div>
              ))}
            </div>
          </ScrollArea>

          {editHistory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              История редактирования пуста
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}