'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-brand-border bg-brand-dark">
      <div>
        <h1 className="text-2xl font-bold text-brand-text">{title}</h1>
        {subtitle && <p className="text-base text-brand-muted mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text transition-colors px-3 py-2 rounded-lg hover:bg-brand-card"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </header>
  )
}
