"use client"

import { motion } from 'framer-motion'
import { MapPin, Code, Heart, Users, Zap, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  { icon: Code, value: "30B", label: "Параметров модели" },
  { icon: Users, value: "1", label: "Разработчик" },
  { icon: MapPin, value: "Краснодар", label: "Местоположение" },
  { icon: Zap, value: "2025", label: "Год создания" }
]

const techStack = [
  "Next.js 15", "React 19", "TypeScript", "Tailwind CSS", 
  "FastAPI", "PostgreSQL", "Prisma", "Clerk Auth"
]

export function About() {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            О проекте <span className="text-primary">Radon AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Российская разработка, созданная с любовью к технологиям и стремлением 
            сделать ИИ доступным для всех
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">История создания</h3>
            </div>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Radon AI родился из желания создать мощную мультимодальную нейросеть, 
                которая будет понимать русский язык лучше зарубежных аналогов. 
                Проект разрабатывается в Краснодаре разработчиком <strong className="text-foreground">MagistrTheOne</strong>.
              </p>
              
              <p>
                Наша цель — сделать передовые технологии ИИ доступными для русскоязычных пользователей, 
                обеспечивая при этом высокое качество генерации текста, анализа изображений и создания кода.
              </p>
              
              <p>
                Radon AI — это не просто копия зарубежных решений, а уникальная разработка, 
                учитывающая особенности русского языка и культуры.
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Технологический стек</h3>
          </div>
          
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Radon AI построен на современных технологиях, обеспечивающих высокую производительность, 
            безопасность и масштабируемость
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                viewport={{ once: true }}
                className="px-4 py-2 rounded-full bg-card border border-border hover:border-primary/50 transition-colors duration-300 text-sm font-medium"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-md border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Наша миссия</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Сделать передовые технологии искусственного интеллекта доступными для русскоязычных пользователей, 
                обеспечивая при этом высокое качество, безопасность данных и поддержку на родном языке. 
                Мы верим, что ИИ должен служить людям и помогать в решении реальных задач.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
