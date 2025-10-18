"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Clock,
  MessageSquare,
} from "lucide-react"
import { useChatContext } from "@/contexts/ChatContext"
import { ChatResponse } from "@/types/chat"
import { format, isToday, isYesterday, isThisWeek } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface ChatManagementProps {
  onChatSelect?: (chatId: string) => void
  className?: string
}

export function ChatManagement({ onChatSelect, className }: ChatManagementProps) {
  const { chats, loading, createChat, deleteChat, updateChat, loadChat } = useChatContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState<"all" | "today" | "week" | "month">("all")
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set())
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newChatTitle, setNewChatTitle] = useState("")

  const formatChatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return "Сегодня"
    if (isYesterday(date)) return "Вчера"
    if (isThisWeek(date)) return format(date, "EEEE", { locale: ru })
    return format(date, "dd.MM.yyyy")
  }

  const filteredChats = chats.filter(chat => {
    // Поиск по названию
    const matchesSearch = chat.title.toLowerCase().includes(searchTerm.toLowerCase())

    // Фильтр по дате
    const chatDate = new Date(chat.createdAt)
    const now = new Date()
    const matchesFilter = (() => {
      switch (filterBy) {
        case "today":
          return isToday(chatDate)
        case "week":
          return isThisWeek(chatDate)
        case "month":
          return chatDate.getMonth() === now.getMonth() && chatDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })()

    return matchesSearch && matchesFilter
  })

  const groupedChats = filteredChats.reduce<Record<string, ChatResponse[]>>(
    (acc, chat) => {
      const key = formatChatDate(chat.createdAt)
      acc[key] = acc[key] || []
      acc[key].push(chat)
      return acc
    },
    {}
  )

  const handleCreateChat = async () => {
    if (!newChatTitle.trim()) return

    await createChat(newChatTitle.trim())
    setNewChatTitle("")
    setIsCreateDialogOpen(false)
  }

  const handleChatSelect = (chatId: string) => {
    loadChat(chatId)
    onChatSelect?.(chatId)
  }

  const handleBulkDelete = async () => {
    for (const chatId of selectedChats) {
      await deleteChat(chatId)
    }
    setSelectedChats(new Set())
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Новый чат
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-100">Создать новый чат</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Название чата..."
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-gray-100"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateChat()}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-gray-600 text-gray-300"
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleCreateChat}
                    disabled={!newChatTitle.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Создать
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {selectedChats.size > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить ({selectedChats.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900 border-gray-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-100">
                    Удалить выбранные чаты?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Это действие нельзя отменить. Будет удалено {selectedChats.size} чатов.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-gray-600 text-gray-300">
                    Отмена
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleBulkDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Поиск чатов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-48 bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400"
            />
          </div>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as "all" | "today" | "week" | "month")}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 text-sm"
          >
            <option value="all">Все чаты</option>
            <option value="today">Сегодня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
          </select>
        </div>
      </div>

      {/* Chat List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-400 py-8">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            Загрузка чатов...
          </div>
        ) : Object.keys(groupedChats).length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Нет чатов</p>
            <p className="text-sm text-gray-500 mt-1">
              Создайте новый чат, чтобы начать общение с Radon AI
            </p>
          </div>
        ) : (
          Object.entries(groupedChats).map(([date, dateChats]) => (
            <div key={date} className="space-y-2">
              <div className="flex items-center gap-2 px-2 text-gray-500">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  {date}
                </span>
              </div>

              <div className="space-y-1">
                {dateChats.map((chat) => (
                  <Card
                    key={chat.id}
                    className={cn(
                      "p-3 cursor-pointer transition-all hover:bg-gray-800 border-gray-700",
                      selectedChats.has(chat.id) && "ring-2 ring-blue-500 bg-blue-500/10"
                    )}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-200 truncate">
                          {chat.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                            {chat.messageCount} сообщений
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {format(new Date(chat.createdAt), "HH:mm")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedChats(prev => {
                              const newSet = new Set(prev)
                              newSet.has(chat.id) ? newSet.delete(chat.id) : newSet.add(chat.id)
                              return newSet
                            })
                          }}
                        >
                          {selectedChats.has(chat.id) ? (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          ) : (
                            <MoreVertical className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
