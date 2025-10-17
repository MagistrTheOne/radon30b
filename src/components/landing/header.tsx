"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { 
  Menu, 
  X, 
  Brain, 
  ChevronDown,
  Zap,
  CreditCard,
  Code,
  Activity,
  HelpCircle,
  BookOpen,
  Users,
  Building,
  FileText,
  Briefcase,
  Mail,
  Shield,
  Cookie
} from 'lucide-react'
import { useUser, SignInButton, UserButton } from '@clerk/nextjs'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSignedIn, user } = useUser()

  const productMenu = [
    { name: 'Возможности', href: '/features', icon: Zap },
    { name: 'Тарифы', href: '/pricing', icon: CreditCard },
    { name: 'API', href: '/api', icon: Code },
    { name: 'Статус', href: '/status', icon: Activity },
  ]

  const supportMenu = [
    { name: 'Поддержка', href: '/support', icon: HelpCircle },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Документация', href: '/docs', icon: BookOpen },
    { name: 'Сообщество', href: '/community', icon: Users },
  ]

  const companyMenu = [
    { name: 'О проекте', href: '/about', icon: Building },
    { name: 'Блог', href: '/blog', icon: FileText },
    { name: 'Карьера', href: '/careers', icon: Briefcase },
    { name: 'Контакты', href: '/contact', icon: Mail },
  ]

  const legalMenu = [
    { name: 'Политика конфиденциальности', href: '/privacy', icon: Shield },
    { name: 'Условия использования', href: '/terms', icon: FileText },
    { name: 'Cookie', href: '/cookies', icon: Cookie },
    { name: 'GDPR', href: '/gdpr', icon: Shield },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold">Radon AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Продукт */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                Продукт
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {productMenu.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Поддержка */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                Поддержка
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {supportMenu.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Компания */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                Компания
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {companyMenu.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Правовая информация */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                Правовая информация
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {legalMenu.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/chat">Чат</Link>
                </Button>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Войти
                  </Button>
                </SignInButton>
                <Button asChild size="sm">
                  <Link href="/sign-up">Начать</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-8 w-8"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Продукт */}
              <div className="px-3 py-2">
                <div className="text-sm font-semibold text-foreground mb-2">Продукт</div>
                <div className="space-y-1 ml-4">
                  {productMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Поддержка */}
              <div className="px-3 py-2">
                <div className="text-sm font-semibold text-foreground mb-2">Поддержка</div>
                <div className="space-y-1 ml-4">
                  {supportMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Компания */}
              <div className="px-3 py-2">
                <div className="text-sm font-semibold text-foreground mb-2">Компания</div>
                <div className="space-y-1 ml-4">
                  {companyMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Правовая информация */}
              <div className="px-3 py-2">
                <div className="text-sm font-semibold text-foreground mb-2">Правовая информация</div>
                <div className="space-y-1 ml-4">
                  {legalMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                {isSignedIn ? (
                  <div className="space-y-2">
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link href="/chat">Чат</Link>
                    </Button>
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm text-muted-foreground">
                        {user?.emailAddresses[0]?.emailAddress}
                      </span>
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8"
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <SignInButton mode="modal">
                      <Button variant="ghost" className="w-full justify-start">
                        Войти
                      </Button>
                    </SignInButton>
                    <Button asChild className="w-full">
                      <Link href="/sign-up">Начать</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
