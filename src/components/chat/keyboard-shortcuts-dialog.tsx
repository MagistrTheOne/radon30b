"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Keyboard,
  Send,
  Image,
  Mic,
  HelpCircle,
  Command,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react"

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Shortcut {
  keys: string[]
  description: string
  icon: React.ReactNode
  category: "messaging" | "navigation" | "general"
}

const shortcuts: Shortcut[] = [
  { keys: ["Enter"], description: "Отправить сообщение", icon: <Send className="w-4 h-4" />, category: "messaging" },
  { keys: ["Shift", "Enter"], description: "Новая строка", icon: <ArrowDown className="w-4 h-4" />, category: "messaging" },
  { keys: ["Ctrl", "K"], description: "Загрузка изображения", icon: <Image className="w-4 h-4" />, category: "messaging" },
  { keys: ["Space"], description: "Запись голосового сообщения", icon: <Mic className="w-4 h-4" />, category: "messaging" },
  { keys: ["↑", "↓"], description: "Навигация по истории", icon: <ArrowUp className="w-4 h-4" />, category: "navigation" },
  { keys: ["/"], description: "Команды (например /help)", icon: <Command className="w-4 h-4" />, category: "navigation" },
  { keys: ["Esc"], description: "Закрыть диалоги", icon: <X className="w-4 h-4" />, category: "general" },
]

const categoryLabels = {
  messaging: "Сообщения",
  navigation: "Навигация",
  general: "Общие",
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  const grouped = shortcuts.reduce<Record<string, Shortcut[]>>((acc, s) => {
    acc[s.category] = acc[s.category] || []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl border-border/50 bg-background/80 backdrop-blur-xl shadow-lg transition-all duration-300"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Keyboard className="w-5 h-5 text-primary" />
            Горячие клавиши
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>

              <div className="divide-y divide-border/50 rounded-lg overflow-hidden border border-border/30">
                {items.map((shortcut, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground">
                        {shortcut.icon}
                      </div>
                      <span className="text-sm">{shortcut.description}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, k) => (
                        <div key={k} className="flex items-center gap-1">
                          <Badge
                            variant="secondary"
                            className="text-xs font-mono bg-background/70 border-border/50"
                          >
                            {key}
                          </Badge>
                          {k < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground text-xs">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {category !== "general" && <Separator className="my-5" />}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/40 rounded-lg border border-border/40">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-primary mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Совет:</p>
              <p>
                Введите{" "}
                <code className="bg-background/50 px-1 rounded font-mono text-xs">
                  /help
                </code>{" "}
                в чате, чтобы открыть это окно.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
