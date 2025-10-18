"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, MapPin, Calendar, Users, Zap, Shield, Globe, Heart, Code, Lightbulb } from 'lucide-react'
import { motion } from 'framer-motion'
import { Footer } from '@/components/landing/footer'
import { Header } from '@/components/landing/header'

export default function AboutPage() {
  const milestones = [
    { date: '2025 Q3', title: 'Начало разработки', description: 'Идея создания российской мультимодальной нейросети' },
    { date: '2025 Q3', title: 'Архитектура модели', description: 'Разработка архитектуры с 30B параметрами' },
    { date: '2025 Q3', title: 'Обучение модели', description: 'Обучение на российских и международных данных' },
    { date: '2025 Q3', title: 'API и интерфейс', description: 'Создание API и веб-интерфейса' },
    { date: '2025 Q4', title: 'Публичный запуск', description: 'Запуск сервиса для широкой аудитории' }
  ]

  const values = [
    { icon: Globe, title: 'Российская разработка', description: 'Создаём технологии будущего в России' },
    { icon: Shield, title: 'Безопасность данных', description: 'Данные хранятся в России с соблюдением законодательства' },
    { icon: Users, title: 'Открытость', description: 'Делаем ИИ доступным для всех' },
    { icon: Lightbulb, title: 'Инновации', description: 'Используем передовые технологии и совершенствуем продукт' }
  ]

  const team = [
    { name: 'MagistrTheOne', role: 'Основатель и главный разработчик', location: 'Краснодар, Россия', bio: 'Full-stack разработчик с опытом в машинном обучении', avatar: 'MT', skills: ['Machine Learning', 'Full-Stack Development', 'System Architecture'] }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                  О проекте <span className="text-primary">Radon AI</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                  Российская мультимодальная нейросеть нового поколения, созданная одним разработчиком из Краснодара
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Краснодар, Россия</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Основан в 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>1 разработчик</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Наша миссия</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Создать передовую мультимодальную нейросеть, которая будет конкурировать с мировыми лидерами, при этом оставаясь российской разработкой, доступной каждому.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <motion.div 
                  key={value.title} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.5 }}>
                  <Card className="text-center">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{value.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">История проекта</h2>
              <p className="text-xl text-muted-foreground">
                Как один разработчик решил создать российскую альтернативу ChatGPT
              </p>
            </div>

            <div className="space-y-8">
              {['Как всё начиналось...', 'Идея создания...', 'Процесс работы...'].map((section, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground leading-relaxed">{section}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
