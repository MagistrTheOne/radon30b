"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Bot, Eye, Ear, Zap } from "lucide-react"
import { QuickActions } from "./quick-actions"

export function WelcomeScreen() {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  const fullText = "Я — Radon. Я вижу. Я слышу. Я готов."
  const typingSpeed = 100 // ms per character

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
    <div className="flex justify-center py-6 sm:py-8 md:py-12">
      <Card className="max-w-xl mx-auto p-6 sm:p-8 text-center bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
        {/* Radon Icon */}
        <motion.div
          className="w-12 h-12 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Bot className="w-6 h-6 text-primary" />
        </motion.div>

        {/* Animated Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">
            Добро пожаловать в Radon AI
          </h3>

          <div className="text-lg sm:text-xl text-muted-foreground mb-6 min-h-[2rem]">
            <span className="font-medium text-primary">{displayedText}</span>
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

        {/* Capabilities Icons */}
        <motion.div
          className="flex justify-center gap-4 sm:gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <motion.div
            className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground"
            whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Вижу</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground"
            whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
          >
            <Ear className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Слышу</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground"
            whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
          >
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Готов</span>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <QuickActions />
        </motion.div>
      </Card>
    </div>
  )
}
