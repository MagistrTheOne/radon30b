"use client"

import { useEffect, useRef, useState } from 'react'
import { Message } from '@/types/chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Copy, RotateCcw, User, Bot, Edit3, Trash2, Save, X, History, Mic } from 'lucide-react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from 'next-themes'
import { useChatContext } from '@/contexts/ChatContext'
import { MessageHistoryDialog } from './message-history-dialog'
import { MessageListSkeleton, LoadingIndicator } from '@/components/loading-states'
import { AudioPlayer } from './audio-player'
import { FunctionCallDisplay, FunctionCall } from './function-call-display'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { editMessage, deleteMessage, regenerateMessage } = useChatContext()
  
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
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
    setEditContent('')
  }

  const saveEdit = async () => {
    if (editingMessageId && editContent.trim()) {
      await editMessage(editingMessageId, editContent.trim())
      setEditingMessageId(null)
      setEditContent('')
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
      toast.success('Скопировано в буфер обмена')
    } catch (error) {
      toast.error('Ошибка копирования')
    }
  }

  const regenerateResponse = async (messageId: string) => {
    await regenerateMessage(messageId)
  }

  const formatMessageContent = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props: any) {
            const { className, children } = props
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match
            return !isInline && match ? (
              <SyntaxHighlighter
                style={theme === 'dark' ? oneDark : undefined}
                language={match[1]}
                PreTag="div"
                className="rounded-md"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className}>
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    )
  }

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 ? (
          <div className="flex justify-center py-12">
            <Card className="max-w-md mx-auto p-8 text-center bg-card/50 backdrop-blur-sm border-border/50">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Добро пожаловать в Radon AI</h3>
              <p className="text-muted-foreground">
                Начните разговор, задав вопрос или загрузив изображение
              </p>
            </Card>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={message.role === 'user' ? undefined : '/bot-avatar.png'} />
                <AvatarFallback>
                  {message.role === 'user' ? (
                    message.audioUrl ? (
                      <Mic className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div
                className={`flex-1 max-w-[80%] ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.imageUrl && (
                    <div className="mb-3">
                      <img
                        src={message.imageUrl}
                        alt="Uploaded content"
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                  )}

    {message.audioUrl && (
      <div className="mb-3">
        <AudioPlayer
          audioUrl={message.audioUrl}
          transcription={message.audioTranscription}
          duration={message.audioDuration}
        />
      </div>
    )}

    {/* Function Calls для API v2.0.0 */}
    {message.functionCalls && message.functionCalls.length > 0 && (
      <div className="mb-3">
        <FunctionCallDisplay functionCalls={message.functionCalls} />
      </div>
    )}
                  
                  {editingMessageId === message.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[100px] resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}>
                          <Save className="w-3 h-3 mr-1" />
                          Сохранить
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="w-3 h-3 mr-1" />
                          Отмена
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

                {/* Action buttons */}
                <div className="flex gap-2 mt-2">
                  {message.role === 'user' && editingMessageId !== message.id && (
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
                  
                  {message.role === 'assistant' && (
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
          ))
        )}

        {isLoading && (
          <div className="flex gap-4">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback>
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-muted p-4 rounded-2xl">
                <LoadingIndicator text="Radon AI печатает..." />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Message History Dialog */}
      <MessageHistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        message={selectedMessage}
      />
    </ScrollArea>
  )
}
