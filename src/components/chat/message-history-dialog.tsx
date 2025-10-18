"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Message } from "@/types/chat"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface MessageHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  message: Message | null
}

export function MessageHistoryDialog({ open, onOpenChange, message }: MessageHistoryDialogProps) {
  const [editHistory, setEditHistory] = useState<
    { id: string; previousContent: string; editedAt: Date }[]
  >([])

  useEffect(() => {
    if (message && open) loadHistory()
  }, [message, open])

  const loadHistory = async () => {
    if (!message) return
    try {
      const res = await fetch(`/api/messages/${message.id}/history`)
      if (!res.ok) throw new Error("Ошибка загрузки истории")
      const data = await res.json()
      setEditHistory(data.editHistory || [])
    } catch (err) {
      console.error("Ошибка загрузки:", err)
      setEditHistory([])
    }
  }

  if (!message) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-background/80 backdrop-blur-xl border-border/50 transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            История редактирования
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Текущая версия */}
          <div className="p-4 rounded-lg border border-border/50 bg-card/60 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Текущая версия
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(message.createdAt), {
                  addSuffix: true,
                  locale: ru,
                })}
              </span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>

          {/* История правок */}
          <ScrollArea className="max-h-96 pr-2">
            {editHistory.length > 0 ? (
              <div className="space-y-3">
                {editHistory.map((edit, i) => (
                  <div
                    key={edit.id}
                    className={cn(
                      "p-4 rounded-lg border transition-all",
                      "bg-muted/40 hover:bg-muted/60 border-border/40"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="text-xs border-border/60 bg-background/40"
                      >
                        Версия {editHistory.length - i}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(edit.editedAt), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {edit.previousContent}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                История редактирования пуста
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
