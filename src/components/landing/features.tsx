"use client"

import { motion } from 'framer-motion'
import { 
  FileText, 
  Image, 
  Code, 
  Layers, 
  Cpu, 
  MapPin,
  CheckCircle
} from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: "Текстовая генерация",
    description: "Создание статей, переводы, анализ документов и генерация контента любой сложности",
    benefits: ["SEO-оптимизированный контент", "Многоязычная поддержка", "Адаптация стиля"]
  },
  {
    icon: Image,
    title: "Анализ изображений",
    description: "Распознавание объектов, описание картинок, анализ медицинских снимков",
    benefits: ["Высокая точность распознавания", "Поддержка всех форматов", "Детальное описание"]
  },
  {
    icon: Code,
    title: "Кодогенерация",
    description: "Написание кода на Python, JavaScript, Go, Rust и других языках программирования",
    benefits: ["Поддержка 20+ языков", "Отладка и оптимизация", "Документация к коду"]
  },
  {
    icon: Layers,
    title: "Мультимодальность",
    description: "Обработка текста, изображений и кода в едином интерфейсе для комплексных задач",
    benefits: ["Единый интерфейс", "Контекстное понимание", "Сложные сценарии"]
  },
  {
    icon: Cpu,
    title: "30B параметров",
    description: "Мощная архитектура с 30 миллиардами параметров для максимальной точности",
    benefits: ["Высокое качество ответов", "Глубокое понимание", "Сложные рассуждения"]
  },
  {
    icon: MapPin,
    title: "Российская разработка",
    description: "Создано в Краснодаре разработчиком MagistrTheOne с фокусом на русский язык",
    benefits: ["Лучшее понимание русского", "Локальная поддержка", "Быстрая разработка"]
  }
]

export function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Возможности <span className="text-primary">Radon AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Мультимодальная нейросеть нового поколения с уникальными возможностями 
            для решения любых задач
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              {/* Glass morphism effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
