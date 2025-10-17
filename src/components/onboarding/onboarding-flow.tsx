"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

  const handleUseCaseToggle = (useCaseId: string) => {
    setSelectedUseCases(prev => 
      prev.includes(useCaseId) 
        ? prev.filter(id => id !== useCaseId)
        : [...prev, useCaseId]
    )
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const renderStep1 = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
        <Brain className="w-8 h-8 text-primary" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">Добро пожаловать в Radon AI!</h2>
        <p className="text-muted-foreground">
          Давайте настроим ваш профиль для лучшего опыта
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
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Как вы планируете использовать Radon AI?</h2>
        <p className="text-muted-foreground">
          Выберите области, которые вас интересуют
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {useCases.map((useCase) => (
          <Card 
            key={useCase.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedUseCases.includes(useCase.id)
                ? 'border-primary bg-primary/5'
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
              <div className="space-y-1">
                {useCase.examples.map((example, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {example}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">Попробуйте первый запрос!</h2>
        <p className="text-muted-foreground">
          Давайте создадим ваш первый чат с Radon AI
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" />
              <span>Выберите тип запроса</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" />
              <span>Получите мгновенный ответ</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" />
              <span>Изучите возможности AI</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
        <Zap className="w-8 h-8 text-primary" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">Готово к работе!</h2>
        <p className="text-muted-foreground">
          Теперь вы можете начать использовать Radon AI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2">Начать чат</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Создайте новый чат и попробуйте возможности AI
            </p>
            <Button 
              size="sm" 
              onClick={() => {
                router.push('/chat')
                onComplete()
              }}
            >
              Начать
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2">Обновить план</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Получите больше возможностей с Pro планом
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                router.push('/subscription')
                onComplete()
              }}
            >
              Обновить
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
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

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            Пропустить
          </Button>
          
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Назад
              </Button>
            )}
            
            <Button 
              onClick={handleNext}
              disabled={currentStep === 1 && !firstName.trim()}
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
