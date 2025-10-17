"use client"

import Link from 'next/link'
import { Brain, Mail, MessageCircle, Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  const productLinks = [
    { name: 'Возможности', href: '/features' },
    { name: 'Тарифы', href: '/pricing' },
    { name: 'API', href: '/api' },
    { name: 'Статус', href: '/status' },
  ]

  const supportLinks = [
    { name: 'FAQ', href: '/faq' },
    { name: 'Документация', href: '/docs' },
    { name: 'Сообщество', href: '/community' },
  ]

  const companyLinks = [
    { name: 'О проекте', href: '/about' },
    { name: 'Блог', href: '/blog' },
    { name: 'Карьера', href: '/careers' },
    { name: 'Контакты', href: '/contact' },
  ]

  const legalLinks = [
    { name: 'Политика конфиденциальности', href: '/privacy' },
    { name: 'Условия использования', href: '/terms' },
    { name: 'Cookie', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
  ]

  const socialLinks = [
    { name: 'Discord', href: '#', icon: MessageCircle },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
  ]

  return (
    <footer className="bg-background border-t border-border/50">
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
            <p className="text-sm text-muted-foreground mb-4">
              Российская мультимодальная нейросеть 30B параметров от MagistrTheOne
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Продукт */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Продукт</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
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

          {/* Поддержка */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Поддержка</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
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

          {/* Компания */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Компания</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
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

          {/* Правовая информация */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Правовая информация</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
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

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Radon AI. Все права защищены.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Сделано  в</span>
              <span className="font-medium">Краснодаре</span>
              <span>🇷🇺</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}