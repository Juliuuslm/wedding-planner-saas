'use client'

import { useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Sidebar, SidebarContent } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { useNavigation } from '@/hooks/useNavigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { activeSegment } = useNavigation()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-60 p-0 bg-brand border-r-0">
          <SidebarContent activeSegment={activeSegment} />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-surface p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
