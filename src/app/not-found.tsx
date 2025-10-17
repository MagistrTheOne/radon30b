import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Страница не найдена
          </h2>
          <p className="text-muted-foreground mb-8">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                На главную
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/chat" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Попробовать чат
              </Link>
            </Button>
          </div>

          <div className="pt-4">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться назад
            </Button>
          </div>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>Если вы считаете, что это ошибка, пожалуйста,</p>
          <Link href="/contact" className="text-primary hover:underline">
            свяжитесь с нами
          </Link>
        </div>
      </div>
    </div>
  )
}
