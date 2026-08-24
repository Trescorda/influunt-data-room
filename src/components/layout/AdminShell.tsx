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
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center px-4 py-3 bg-white/90 backdrop-blur-xl border-b border-inf-line">
        <button onClick={() => setSidebarOpen(true)} className="text-inf-muted hover:text-inf-green p-1">
          <Menu size={22} />
        </button>
        <img src="/influunt-lockup-light.png" alt="Influunt" width={100} className="ml-3" />
      </div>
      <div className="md:ml-52 flex flex-col h-screen overflow-y-auto pt-14 md:pt-0">{children}</div>
    </div>
  )
}
