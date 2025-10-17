"use client"

import { useState } from 'react'
import { ChatSidebar } from '@/components/chat/chat-sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import { Menu } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { UserButtonWrapper } from '@/components/user-button-wrapper'
import { ChatProvider } from '@/contexts/ChatContext'
import { ErrorBoundary } from '@/components/error-boundary'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useUser()

  return (
    <ErrorBoundary>
      <ChatProvider>
        <div className="flex h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-80 md:flex-col">
          <ChatSidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed top-4 left-4 z-50"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <ChatSidebar onClose={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">Radon AI</h1>
              <span className="text-sm text-muted-foreground">
                {user?.emailAddresses[0]?.emailAddress}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <UserButtonWrapper />
            </div>
          </header>

          {/* Chat Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      </ChatProvider>
    </ErrorBoundary>
  )
}
