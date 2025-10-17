"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
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
  User
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format, isToday, isYesterday, isThisWeek } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChatResponse } from '@/types/chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface ChatSidebarProps {
  onClose?: () => void
}

export function ChatSidebar({ onClose }: ChatSidebarProps) {
  const [chats, setChats] = useState<ChatResponse[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/api/chats')
      // setChats(response.data)
      
      // Mock data for now
      const mockChats: ChatResponse[] = [
        {
          id: '1',
          title: 'Помощь с кодом на Python',
          createdAt: new Date().toISOString(),
          messageCount: 5
        },
        {
          id: '2', 
          title: 'Анализ изображения',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          messageCount: 3
        }
      ]
      setChats(mockChats)
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewChat = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.post('/api/chats/new', { title: 'Новый чат' })
      // router.push(`/chat/${response.data.id}`)
      
      // Mock navigation for now
      router.push('/chat')
      onClose?.()
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  const deleteChat = async (chatId: string) => {
    try {
      // TODO: Replace with actual API call
      // await apiClient.delete(`/api/chats/${chatId}`)
      setChats(chats.filter(chat => chat.id !== chatId))
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const formatChatDate = (dateString: string) => {
    const date = new Date(dateString)
    
    if (isToday(date)) {
      return 'Сегодня'
    } else if (isYesterday(date)) {
      return 'Вчера'
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE', { locale: ru })
    } else {
      return format(date, 'dd.MM.yyyy')
    }
  }

  const groupChatsByDate = (chats: ChatResponse[]) => {
    const groups: { [key: string]: ChatResponse[] } = {}
    
    chats.forEach(chat => {
      const dateKey = formatChatDate(chat.createdAt)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(chat)
    })
    
    return groups
  }

  const getSubscriptionBadge = () => {
    // TODO: Get actual subscription from user data
    const subscription = 'free' as 'free' | 'pro' | 'enterprise' // user?.publicMetadata?.subscription || 'free'
    
    switch (subscription) {
      case 'pro':
        return <Badge className="bg-primary text-primary-foreground"><Crown className="w-3 h-3 mr-1" />Pro</Badge>
      case 'enterprise':
        return <Badge className="bg-purple-500 text-white"><Crown className="w-3 h-3 mr-1" />Enterprise</Badge>
      default:
        return <Badge variant="secondary"><Zap className="w-3 h-3 mr-1" />Free</Badge>
    }
  }

  const groupedChats = groupChatsByDate(chats)

  return (
    <div className="flex flex-col h-full bg-sidebar/95 backdrop-blur-md border-r border-sidebar-border">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border backdrop-blur-sm bg-sidebar/50">
        <Button 
          onClick={createNewChat}
          className="w-full justify-start gap-2"
          size="lg"
        >
          <Plus className="w-4 h-4" />
          Новый чат
        </Button>
      </div>

      {/* Subscription Status */}
      <div className="p-4 border-b border-sidebar-border backdrop-blur-sm bg-sidebar/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-sidebar-foreground">Подписка</span>
          {getSubscriptionBadge()}
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : Object.keys(groupedChats).length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Нет чатов</p>
              <p className="text-xs">Создайте новый чат, чтобы начать</p>
            </div>
          ) : (
            Object.entries(groupedChats).map(([dateGroup, dateChats]) => (
              <div key={dateGroup} className="space-y-2">
                <div className="flex items-center gap-2 px-2">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {dateGroup}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {dateChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="group flex items-center gap-2 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer"
                      onClick={() => {
                        router.push(`/chat/${chat.id}`)
                        onClose?.()
                      }}
                    >
                      <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {chat.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
                          <DropdownMenuItem>
                            <Edit3 className="w-3 h-3 mr-2" />
                            Переименовать
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteChat(chat.id)
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
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.emailAddresses[0]?.emailAddress || 'Пользователь'
              }
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Настройки
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/subscription">
                  <Crown className="w-4 h-4 mr-2" />
                  Управление подпиской
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="w-4 h-4 mr-2" />
                  Профиль
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
