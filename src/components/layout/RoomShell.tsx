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
    <div className="min-h-screen bg-brand-darker">
      <InvestorSidebar isAdmin={isAdmin} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-60 flex flex-col min-h-screen">
        <Header
          title="Data Room"
          subtitle="Influunt — Seed Round $5M"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
