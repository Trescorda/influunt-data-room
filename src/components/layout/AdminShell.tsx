'use client'

import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { Menu } from 'lucide-react'

interface AdminShellProps {
  children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Mobile header for hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center px-4 py-3 bg-inf-obsidian border-b border-white/10">
        <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white p-1">
          <Menu size={22} />
        </button>
        <img src="/influunt-lockup-dark.png" alt="Influunt" width={100} className="ml-3" />
      </div>
      <div className="md:ml-64 flex flex-col h-screen overflow-y-auto pt-14 md:pt-0">{children}</div>
    </div>
  )
}
