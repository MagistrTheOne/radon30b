"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Bot, Eye, Ear, Zap } from 'lucide-react'
import { QuickActions } from './quick-actions'

export function WelcomeScreen() {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const fullText = "Я — Radon. Я вижу. Я слышу. Я готов."
  const typingSpeed = 100 // ms per character

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, typingSpeed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, fullText])

  return (
    <div className="flex justify-center py-12">
      <Card className="max-w-2xl mx-auto p-8 text-center bg-card/50 backdrop-blur-sm border-border/50">
        {/* Radon Icon */}
        <motion.div 
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Bot className="w-8 h-8 text-primary" />
        </motion.div>

        {/* Animated Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-foreground">
            Добро пожаловать в Radon AI
          </h3>
          
          <div className="text-lg text-muted-foreground mb-6 min-h-[2rem]">
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
          className="flex justify-center gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>Вижу</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Ear className="w-4 h-4" />
            <span>Слышу</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>Готов</span>
          </div>
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
