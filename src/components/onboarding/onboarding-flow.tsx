"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MessageSquare, 
  Code, 
  Image, 
  Zap, 
  ArrowRight, 
  Check,
  Brain,
  Sparkles
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OnboardingFlowProps {
  onComplete: () => void
}

const useCases = [
  {
    id: 'text',
    name: 'Текстовая генерация',
    description: 'Создание контента, переводы, анализ текста',
    icon: MessageSquare,
    examples: ['Написать статью', 'Перевести документ', 'Анализ тональности']
  },
  {
    id: 'code',
    name: 'Генерация кода',
    description: 'Создание и отладка кода на разных языках',
    icon: Code,
    examples: ['React компонент', 'Python скрипт', 'SQL запрос']
  },
  {
    id: 'image',
    name: 'Анализ изображений',
    description: 'Описание, анализ и работа с изображениями',
    icon: Image,
    examples: ['Описать фото', 'Анализ диаграммы', 'OCR текст']
  }
]

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])
  const [firstName, setFirstName] = useState('')
  const router = useRouter()

  const handleUseCaseToggle = (id: string) => {
    setSelectedUseCases(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
    else onComplete()
  }

  const handleSkip = () => onComplete()

  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }

  const Step1 = (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center space-y-6"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
        <Brain className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Добро пожаловать в Radon AI</h2>
        <p className="text-muted-foreground">
          Давайте настроим ваш первый опыт, чтобы всё работало идеально.
        </p>
      </div>
      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Ваше имя"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Имя поможет персонализировать ваш опыт и рекомендации.
        </p>
      </div>
    </motion.div>
  )

  const Step2 = (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Как вы хотите использовать Radon AI?</h2>
        <p className="text-muted-foreground">Выберите один или несколько сценариев.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {useCases.map(useCase => (
          <Card
            key={useCase.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedUseCases.includes(useCase.id)
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => handleUseCaseToggle(useCase.id)}
          >
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <useCase.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{useCase.name}</CardTitle>
              <CardDescription>{useCase.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {useCase.examples.map((ex, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    • {ex}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  )

  const Step3 = (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center space-y-6"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Попробуйте свой первый запрос</h2>
        <p className="text-muted-foreground">Создайте чат и посмотрите, как Radon реагирует.</p>
      </div>
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 space-y-3">
          {['Выберите тип запроса', 'Получите мгновенный ответ', 'Изучите возможности AI'].map((text, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" />
              <span>{text}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )

  const Step4 = (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center space-y-6"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
        <Zap className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Готово, {firstName || 'друг'}!</h2>
        <p className="text-muted-foreground">Теперь можно перейти к практике.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2">Начать чат</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Попробуйте Radon прямо сейчас — текст, код или изображение.
            </p>
            <Button
              size="sm"
              onClick={() => {
                router.push('/chat')
                onComplete()
              }}
              className="hover:translate-y-[-2px] transition-transform"
            >
              Начать
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2">Обновить план</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Откройте Pro-режим для ускорения и большего контекста.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push('/pricing')
                onComplete()
              }}
              className="hover:translate-y-[-2px] transition-transform"
            >
              Обновить
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Animated step content */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && <motion.div key="1" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">{Step1}</motion.div>}
              {currentStep === 2 && <motion.div key="2" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">{Step2}</motion.div>}
              {currentStep === 3 && <motion.div key="3" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">{Step3}</motion.div>}
              {currentStep === 4 && <motion.div key="4" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">{Step4}</motion.div>}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            Пропустить
          </Button>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                Назад
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={currentStep === 1 && !firstName.trim()}
              className="hover:translate-y-[-2px] transition-transform"
            >
              {currentStep === 4 ? 'Завершить' : 'Далее'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
