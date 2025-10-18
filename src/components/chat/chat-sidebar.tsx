"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit3,
  MoreHorizontal,
  Calendar,
  Crown,
  Zap,
  Settings,
  LogOut,
  User,
  Users,
  BarChart3,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser, useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { format, isToday, isYesterday, isThisWeek } from "date-fns"
import { ru } from "date-fns/locale"
import { ChatResponse } from "@/types/chat"
import { subscriptionApi } from "@/lib/subscription-api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChatContext } from "@/contexts/ChatContext"
import { RenameChatDialog } from "./rename-chat-dialog"
import { MessageListSkeleton } from "@/components/loading-states"
import { UsageWidget } from "./usage-widget"
import { RadonStatus } from "@/components/radon/radon-status"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  defaultOpen?: boolean
}

export function ChatSidebar({ defaultOpen = true }: ChatSidebarProps) {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [chatToRename, setChatToRename] = useState<ChatResponse | null>(null)
  const [subscription, setSubscription] = useState<
    "free" | "pro" | "enterprise"
  >("free")

  const { user } = useUser()
  const { signOut } = useClerk()
  const { chats, loading, createChat, deleteChat, updateChat, loadChat } =
    useChatContext()

  useEffect(() => {
    const loadSubscription = async () => {
      if (!user?.id) return
      try {
        const response = await subscriptionApi.getCurrentSubscription()
        setSubscription(response.data.tier as "free" | "pro" | "enterprise")
      } catch {
        setSubscription("free")
      }
    }
    loadSubscription()
  }, [user?.id])

  const createNewChat = async () => await createChat("Новый чат")

  const handleDeleteChat = async (id: string) => deleteChat(id)
  const handleRenameChat = (chat: ChatResponse) => {
    setChatToRename(chat)
    setRenameDialogOpen(true)
  }

  const handleRenameConfirm = async (newTitle: string) => {
    if (chatToRename) await updateChat(chatToRename.id, newTitle)
    setRenameDialogOpen(false)
    setChatToRename(null)
  }

  const formatChatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return "Сегодня"
    if (isYesterday(date)) return "Вчера"
    if (isThisWeek(date)) return format(date, "EEEE", { locale: ru })
    return format(date, "dd.MM.yyyy")
  }

  const groupedChats = chats.reduce<Record<string, ChatResponse[]>>(
    (acc, chat) => {
      const key = formatChatDate(chat.createdAt)
      acc[key] = acc[key] || []
      acc[key].push(chat)
      return acc
    },
    {}
  )

  const subscriptionBadge = {
    free: (
      <Badge variant="secondary">
        <Zap className="w-3 h-3 mr-1" /> Free
      </Badge>
    ),
    pro: (
      <Badge className="bg-primary text-primary-foreground">
        <Crown className="w-3 h-3 mr-1" /> Pro
      </Badge>
    ),
    enterprise: (
      <Badge className="bg-purple-600 text-white">
        <Crown className="w-3 h-3 mr-1" /> Enterprise
      </Badge>
    ),
  }[subscription]

  return (
    <div className="flex flex-col h-full bg-[#171717] border-r border-[#2f2f2f] overflow-hidden">
      {/* Header */}
            <div className="p-4 border-b border-[#2f2f2f]">
              <Button
                onClick={createNewChat}
                className="w-full justify-start gap-2 bg-[#2f2f2f]/80 hover:bg-[#404040]/80 text-white border-[#404040] transition-all duration-200 backdrop-blur-md shadow-lg hover:shadow-xl"
                size="lg"
              >
                <Plus className="w-4 h-4" />
                Новый чат
              </Button>
            </div>

            {/* Usage Widget */}
            <div className="p-4 border-b border-[#2f2f2f]">
              <UsageWidget subscription={subscription} />
            </div>

            {/* Radon AI Status */}
            <div className="p-4 border-b border-[#2f2f2f]">
              <RadonStatus />
            </div>

            {/* Chats */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {loading ? (
                  <MessageListSkeleton />
                ) : Object.keys(groupedChats).length === 0 ? (
                  <div className="text-center text-[#8e8ea0] py-8 animate-fade-in">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Нет чатов</p>
                  </div>
                ) : (
                  Object.entries(groupedChats).map(([date, dateChats]) => (
                    <div key={date} className="space-y-1">
                      <div className="flex items-center gap-2 px-2 text-[#8e8ea0]">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {date}
                        </span>
                      </div>
                      {dateChats.map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => loadChat(chat.id)}
                          className={cn(
                            "group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all",
                            "hover:bg-[#2f2f2f]/80 active:scale-[0.99] backdrop-blur-sm transition-all"
                          )}
                        >
                          <MessageSquare className="w-4 h-4 text-[#8e8ea0] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-white">
                              {chat.title}
                            </p>
                            <p className="text-xs text-[#8e8ea0]">
                              {chat.messageCount} сообщений
                            </p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleRenameChat(chat)}
                              >
                                <Edit3 className="w-3 h-3 mr-2" />
                                Переименовать
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-400 hover:text-red-300"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteChat(chat.id)
                                }}
                              >
                                <Trash2 className="w-3 h-3 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* User Section */}
            <div className="p-4 border-t border-[#2f2f2f] bg-[#1a1a1a] backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                    {user?.firstName?.charAt(0) ||
                      user?.emailAddresses[0]?.emailAddress?.charAt(0) ||
                      "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-white">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.emailAddresses[0]?.emailAddress || "Пользователь"}
                  </p>
                  <p className="text-xs text-[#8e8ea0] truncate">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <Settings className="w-4 h-4 mr-2" />
                        Настройки
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <Crown className="w-4 h-4 mr-2" />
                        Подписка
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <User className="w-4 h-4 mr-2" />
                        Профиль
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-400 hover:text-red-300"
                      onClick={() => signOut()}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-2">{subscriptionBadge}</div>
            </div>

      <RenameChatDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        chat={chatToRename}
        onConfirm={handleRenameConfirm}
        onDelete={() => {
          if (chatToRename) {
            handleDeleteChat(chatToRename.id)
            setRenameDialogOpen(false)
            setChatToRename(null)
          }
        }}
      />
    </div>
  )
}
