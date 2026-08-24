'use client'

import { useState } from 'react'
import { InvestorSidebar } from './InvestorSidebar'
import { Header } from './Header'

interface RoomShellProps {
  isAdmin: boolean
  children: React.ReactNode
}

export function RoomShell({ isAdmin, children }: RoomShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <InvestorSidebar isAdmin={isAdmin} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-52 flex flex-col min-h-screen">
        <Header
          title="Data Room"
          subtitle="Influunt — Pre-Seed A$1.6M"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
