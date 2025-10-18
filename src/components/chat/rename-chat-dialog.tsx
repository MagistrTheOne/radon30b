'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ChatResponse } from '@/types/chat'

interface RenameChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chat: ChatResponse | null
  onConfirm: (newTitle: string) => void
  onDelete: () => void // Added delete handler
}

export function RenameChatDialog({ 
  open, 
  onOpenChange, 
  chat, 
  onConfirm,
  onDelete // Added delete handler as a prop
}: RenameChatDialogProps) {
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    if (chat) {
      setNewTitle(chat.title)
    }
  }, [chat])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTitle.trim()) {
      onConfirm(newTitle.trim())
    }
  }

  const handleDelete = () => {
    if (chat && confirm(`Вы уверены, что хотите удалить чат "${chat.title}"?`)) {
      onDelete() // Call the delete handler
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setNewTitle('')
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Переименовать чат</DialogTitle>
            <DialogDescription>
              Введите новое название для чата &quot;{chat?.title}&quot;
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Название
              </Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="col-span-3"
                placeholder="Название чата"
                autoFocus
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={!newTitle.trim()}
            >
              Сохранить
            </Button>
            {/* Delete Button */}
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete} 
              className="ml-2"
            >
              Удалить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
