"use client"

import { useState } from 'react'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const [completed, setCompleted] = useState(false)
  const router = useRouter()

  const handleComplete = () => {
    setCompleted(true)
    // Store onboarding completion in localStorage
    localStorage.setItem('onboarding_completed', 'true')
    // Redirect to main chat page
    router.push('/chat')
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Добро пожаловать!</h1>
          <p className="text-muted-foreground">Перенаправляем вас в чат...</p>
        </div>
      </div>
    )
  }

  return <OnboardingFlow onComplete={handleComplete} />
}
