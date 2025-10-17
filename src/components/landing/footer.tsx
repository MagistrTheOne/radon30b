"use client"

import Link from 'next/link'
import { Brain, Mail, Github, MapPin, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Возможности', href: '#features' },
      { name: 'Тарифы', href: '#pricing' },
      { name: 'API', href: '/docs' },
      { name: 'Статус', href: '/status' },
    ],
    support: [
      { name: 'Документация', href: '/docs' },
      { name: 'Поддержка', href: '/support' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Сообщество', href: '/community' },
    ],
    company: [
      { name: 'О проекте', href: '#about' },
      { name: 'Блог', href: '/blog' },
      { name: 'Карьера', href: '/careers' },
      { name: 'Контакты', href: '/contact' },
    ],
    legal: [
      { name: 'Политика конфиденциальности', href: '/privacy' },
      { name: 'Условия использования', href: '/terms' },
      { name: 'Cookie', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
    ],
  }

  return (
    <footer className="bg-card/50 backdrop-blur-md border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold">Radon AI</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Российская мультимодальная нейросеть 30B параметров для генерации текста, 
              анализа изображений и создания кода.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Краснодар, Россия</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Продукт</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Компания</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Правовая информация</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {currentYear} Radon AI. Разработано с</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>в России</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="mailto:support@radonai.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>support@radonai.com</span>
              </Link>
              
              <Link
                href="https://github.com/magistrtheone"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
