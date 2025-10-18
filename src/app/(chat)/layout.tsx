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
        <div className="flex h-screen bg-[#212121]">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex md:w-64 md:flex-col bg-[#171717] border-r border-[#2f2f2f]">
            <ChatSidebar />
          </div>

          {/* Mobile Sidebar */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden fixed top-4 left-4 z-50 bg-[#2f2f2f] hover:bg-[#404040] border border-[#404040]"
              >
                <Menu className="h-5 w-5 text-gray-300" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0 bg-[#171717] border-[#2f2f2f]"
            >
              <ChatSidebar />
            </SheetContent>
          </Sheet>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-[#2f2f2f] bg-[#212121]">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-medium text-white">Radon AI</h1>
                <span className="text-sm text-[#8e8ea0]">
                  {user?.emailAddresses[0]?.emailAddress}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <UserButtonWrapper />
              </div>
            </header>

            {/* Chat Content */}
            <main className="flex-1 overflow-hidden bg-[#212121]">
              {children}
            </main>
          </div>
        </div>
      </ChatProvider>
    </ErrorBoundary>
  )
}
