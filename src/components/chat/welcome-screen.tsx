"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bot, Eye, Ear, Zap, MessageSquare } from "lucide-react"
import { QuickActions } from "./quick-actions"

export function WelcomeScreen() {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  const fullText = "Я — Radon. Я вижу. Я слышу. Я готов."
  const typingSpeed = 80 // ms per character

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, typingSpeed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, fullText])

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      {/* Radon Icon */}
      <motion.div
        className="w-16 h-16 mb-6 rounded-full bg-[#2f2f2f]/80 border border-[#404040] flex items-center justify-center backdrop-blur-md shadow-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Bot className="w-8 h-8 text-[#10a37f]" />
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h1 className="text-2xl font-semibold text-white mb-2">
          Добро пожаловать в Radon AI
        </h1>
        
        <div className="text-lg text-[#8e8ea0] min-h-[1.5rem]">
          <span className="font-medium text-[#10a37f]">{displayedText}</span>
          {currentIndex < fullText.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="ml-1"
            >
              |
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* Capabilities */}
      <motion.div
        className="flex justify-center gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <div className="flex items-center gap-2 text-sm text-[#8e8ea0]">
          <Eye className="w-4 h-4" />
          <span>Вижу</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#8e8ea0]">
          <Ear className="w-4 h-4" />
          <span>Слышу</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#8e8ea0]">
          <Zap className="w-4 h-4" />
          <span>Готов</span>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.3 }}
      >
        <QuickActions />
      </motion.div>

      {/* Start Message */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <p className="text-sm text-[#8e8ea0]">
          Начните новый разговор или выберите существующий чат из боковой панели
        </p>
      </motion.div>
    </div>
  )
}
