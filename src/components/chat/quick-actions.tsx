"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import {
  FileText,
  Image,
  Code,
  Mic,
  Languages,
  BarChart3,
  Sparkles,
} from "lucide-react"
import { useChatContext } from "@/contexts/ChatContext"
import { cn } from "@/lib/utils"

interface QuickAction {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  prompt: string
  category: "text" | "image" | "code" | "audio" | "translate" | "analyze"
}

const quickActions: QuickAction[] = [
  {
    id: "text",
    icon: <FileText className="w-5 h-5" />,
    title: "Текст",
    description: "Создать контент",
    prompt: "Напиши интересную статью о...",
    category: "text",
  },
  {
    id: "image",
    icon: <Image className="w-5 h-5" />,
    title: "Изображение",
    description: "Анализ картинок",
    prompt: "Проанализируй это изображение и опиши, что видишь",
    category: "image",
  },
  {
    id: "code",
    icon: <Code className="w-5 h-5" />,
    title: "Код",
    description: "Программирование",
    prompt: "Напиши код на Python для...",
    category: "code",
  },
  {
    id: "audio",
    icon: <Mic className="w-5 h-5" />,
    title: "Аудио",
    description: "Голосовые сообщения",
    prompt: "Запиши голосовое сообщение",
    category: "audio",
  },
  {
    id: "translate",
    icon: <Languages className="w-5 h-5" />,
    title: "Перевод",
    description: "Перевести текст",
    prompt: "Переведи этот текст на английский:",
    category: "translate",
  },
  {
    id: "analyze",
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Анализ",
    description: "Анализ данных",
    prompt: "Проанализируй эти данные и сделай выводы",
    category: "analyze",
  },
]

export function QuickActions() {
  const { createChat } = useChatContext()
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)

  const handleActionClick = async (action: QuickAction) => {
    await createChat(`Новый чат — ${action.title}`)
    // сюда можно будет вставить промпт в input
  }

  const mobile = quickActions.slice(0, 3)

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="text-sm font-semibold text-[#8e8ea0] mb-1">
          Быстрые действия
        </h4>
        <p className="text-xs text-[#8e8ea0]/80">
          Выберите тип задачи, чтобы начать
        </p>
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-3 gap-3 sm:hidden">
        {mobile.map((action, i) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.5 + i * 0.1 }}
          >
            <Card
              onClick={() => handleActionClick(action)}
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
              className={cn(
                "cursor-pointer border border-[#404040] p-3 rounded-xl transition-all",
                "bg-[#2f2f2f]/80 hover:bg-[#404040]/80 backdrop-blur-md",
                "hover:shadow-[0_0_15px_rgba(16,163,127,0.1)] active:scale-[0.97]"
              )}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="w-8 h-8 mb-2 flex items-center justify-center rounded-md bg-[#10a37f]/20 text-[#10a37f]"
                  whileHover={{ scale: 1.1 }}
                >
                  {action.icon}
                </motion.div>
                <p className="text-xs font-medium text-white">{action.title}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.5 + i * 0.1 }}
          >
            <Card
              onClick={() => handleActionClick(action)}
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
              className={cn(
                "group cursor-pointer p-4 rounded-xl border border-[#404040]",
                "bg-[#2f2f2f]/80 transition-all duration-300 backdrop-blur-md",
                "hover:bg-[#404040]/80 hover:shadow-[0_0_20px_rgba(16,163,127,0.15)] hover:-translate-y-1"
              )}
            >
              <div className="text-center">
                <motion.div
                  className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-lg bg-[#10a37f]/20 text-[#10a37f] transition-transform"
                  whileHover={{ scale: 1.12 }}
                  transition={{ duration: 0.25 }}
                >
                  {action.icon}
                </motion.div>
                <p className="text-sm font-medium mb-1 text-white">{action.title}</p>
                <p className="text-xs text-[#8e8ea0] leading-snug">
                  {action.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* декоративная вспышка */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.2 }}
      >
        <Sparkles className="w-4 h-4 text-[#10a37f]/40" />
      </motion.div>
    </div>
  )
}
