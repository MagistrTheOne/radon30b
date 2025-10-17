"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Send, Loader2 } from 'lucide-react'

interface ContactFormProps {
  type?: 'contact' | 'support' | 'gdpr' | 'bug_report'
  defaultSubject?: string
  className?: string
}

export function ContactForm({ type = 'contact', defaultSubject = '', className = '' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: defaultSubject,
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Пожалуйста, заполните все обязательные поля')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          type
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка отправки сообщения')
      }

      toast.success(data.message || 'Сообщение отправлено успешно!')
      
      // Очищаем форму
      setFormData({
        name: '',
        email: '',
        subject: defaultSubject,
        message: ''
      })

    } catch (error) {
      console.error('Error submitting contact form:', error)
      toast.error(error instanceof Error ? error.message : 'Ошибка отправки сообщения')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Имя *
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Ваше имя"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Тема
        </label>
        <Input
          id="subject"
          name="subject"
          type="text"
          placeholder="Краткое описание проблемы"
          value={formData.subject}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Сообщение *
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder={
            type === 'support' 
              ? "Подробно опишите вашу проблему или вопрос..."
              : type === 'gdpr'
              ? "Опишите ваш запрос по обработке персональных данных..."
              : type === 'bug_report'
              ? "Опишите найденную ошибку и шаги для её воспроизведения..."
              : "Подробно опишите ваш вопрос или предложение..."
          }
          rows={6}
          value={formData.message}
          onChange={handleInputChange}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-start gap-3">
        <input 
          type="checkbox" 
          id="consent" 
          required 
          className="mt-1" 
          disabled={isSubmitting}
        />
        <label htmlFor="consent" className="text-sm text-muted-foreground">
          Я согласен на обработку моих персональных данных в соответствии с{' '}
          <a href="/privacy" className="text-primary hover:underline">
            Политикой конфиденциальности
          </a>
        </label>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Отправка...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Отправить сообщение
          </>
        )}
      </Button>
    </form>
  )
}
