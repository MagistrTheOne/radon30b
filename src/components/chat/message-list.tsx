"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Message } from "@/types/chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Copy,
  RotateCcw,
  User,
  Bot,
  Edit3,
  Trash2,
  Save,
  X,
  History,
  Mic,
} from "lucide-react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"
import { useChatContext } from "@/contexts/ChatContext"
import { MessageHistoryDialog } from "./message-history-dialog"
import { LoadingIndicator } from "@/components/loading-states"
import { AudioPlayer } from "./audio-player"
import { FunctionCall, FunctionCallDisplay } from "./function-call-display"
import { WelcomeScreen } from "./welcome-screen"
import { cn } from "@/lib/utils"

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { editMessage, deleteMessage, regenerateMessage } = useChatContext()

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement =
        scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages, isLoading])

  const startEdit = (message: Message) => {
    setEditingMessageId(message.id)
    setEditContent(message.content)
  }

  const cancelEdit = () => {
    setEditingMessageId(null)
    setEditContent("")
  }

  const saveEdit = async () => {
    if (editingMessageId && editContent.trim()) {
      await editMessage(editingMessageId, editContent.trim())
      setEditingMessageId(null)
      setEditContent("")
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage(messageId)
  }

  const showHistory = (message: Message) => {
    setSelectedMessage(message)
    setHistoryDialogOpen(true)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Скопировано")
    } catch {
      toast.error("Ошибка копирования")
    }
  }

  const regenerateResponse = async (messageId: string) => {
    await regenerateMessage(messageId)
  }

  const formatMessageContent = (content: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code(props: { className?: string; children?: React.ReactNode }) {
          const { className, children } = props
          const match = /language-(\w+)/.exec(className || "")
          return match ? (
            <SyntaxHighlighter
              style={theme === "dark" ? oneDark : undefined}
              language={match[1]}
              PreTag="div"
              className="rounded-lg border border-border/40"
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className="px-1 py-0.5 bg-muted/40 rounded text-sm">
              {children}
            </code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )

  if (!messages || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 p-8">
        <div className="text-center max-w-sm">
          <div className="animate-spin w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">
            {isLoading ? 'Загрузка чата...' : 'Подготовка сообщений...'}
          </h3>
          <p className="text-sm text-gray-500">
            {isLoading ? 'Подождите, загружаем историю сообщений' : 'Обновляем содержимое чата'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-2">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          messages.map((message) => {
            const isUser = message.role === "user"
            const isEditing = editingMessageId === message.id

            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 transition-all duration-300 group",
                  isUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                  <AvatarImage
                    src={isUser ? "" : "/bot-avatar.png"}
                    alt="avatar"
                  />
                  <AvatarFallback className={cn(
                    isUser ? "bg-blue-600" : "bg-gray-700"
                  )}>
                    {isUser ? (
                      message.audioUrl ? (
                        <Mic className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )
                    ) : (
                      <Bot className="w-4 h-4 text-gray-300" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    "flex-1 max-w-[85%]",
                    isUser ? "text-right" : "text-left"
                  )}
                >
                  <div
                    className={cn(
                      "inline-block p-3 rounded-2xl transition-all duration-300 relative",
                      isUser
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-800 border border-gray-700 text-gray-100"
                    )}
                  >
                    {/* image */}
                    {message.imageUrl && (
                      <div className="mb-3 relative">
                        <Image
                          src={message.imageUrl}
                          alt="Uploaded content"
                          width={500}
                          height={300}
                          className="rounded-lg border border-border/20"
                        />
                      </div>
                    )}

                    {/* audio */}
                    {message.audioUrl && (
                      <div className="mb-3">
                        <AudioPlayer
                          audioUrl={message.audioUrl}
                          transcription={message.audioTranscription}
                          duration={message.audioDuration}
                        />
                      </div>
                    )}

                    {/* function calls */}
                    {Array.isArray(message.functionCalls) && message.functionCalls.length > 0 && (
                      <div className="mb-3">
                        <FunctionCallDisplay
                          functionCalls={message.functionCalls as FunctionCall[]}
                        />
                      </div>
                    )}
                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[100px] resize-none rounded-lg border-border/40"
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" onClick={saveEdit}>
                            <Save className="w-3 h-3 mr-1" /> Сохранить
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                          >
                            <X className="w-3 h-3 mr-1" /> Отмена
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {formatMessageContent(message.content)}
                        {message.isEdited && (
                          <div className="text-xs text-muted-foreground mt-2 italic">
                            (отредактировано)
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* actions */}
                  <div
                    className={cn(
                      "flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {isUser && !isEditing && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(message)}
                          className="h-8 px-2"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMessage(message.id)}
                          className="h-8 px-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        {message.isEdited && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showHistory(message)}
                            className="h-8 px-2"
                          >
                            <History className="w-3 h-3" />
                          </Button>
                        )}
                      </>
                    )}

                    {!isUser && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.content)}
                          className="h-8 px-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => regenerateResponse(message.id)}
                          className="h-8 px-2"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}

        {isLoading && (
          <div className="flex gap-4 animate-pulse">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback>
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-background/50 backdrop-blur-xl border border-border/40 rounded-2xl p-4 shadow-sm">
                <LoadingIndicator text="Radon AI печатает..." />
              </div>
            </div>
          </div>
        )}
      </div>

      <MessageHistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        message={selectedMessage}
      />
    </ScrollArea>
  )
}
