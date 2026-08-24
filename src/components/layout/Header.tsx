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
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 py-4 border-b border-inf-line bg-white/85 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden text-inf-muted hover:text-inf-green p-1.5 rounded-inf hover:bg-inf-green/[0.06] transition-colors">
            <Menu size={22} />
          </button>
        )}
        <div>
          <h1 className="text-lg md:text-xl font-bold text-inf-green">{title}</h1>
          {subtitle && <p className="text-[13px] md:text-sm text-inf-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-inf-muted hover:text-inf-green transition-colors px-3 py-2 rounded-inf hover:bg-inf-green/[0.06] min-h-[44px]"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
