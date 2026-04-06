'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Menu } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  onMenuClick?: () => void
}

export function Header({ title, subtitle, actions, onMenuClick }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 border-b border-brand-border bg-brand-dark">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden text-brand-muted hover:text-brand-text p-1">
            <Menu size={22} />
          </button>
        )}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-brand-text">{title}</h1>
          {subtitle && <p className="text-sm md:text-base text-brand-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text transition-colors px-3 py-2 rounded-lg hover:bg-brand-card min-h-[44px]"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
