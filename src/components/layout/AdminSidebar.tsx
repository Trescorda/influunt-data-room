'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Users, FolderOpen, Activity, Settings,
  MessageSquare, PieChart, HelpCircle, LogOut, X,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/investors', label: 'Investors', icon: Users },
  { href: '/admin/documents', label: 'Documents', icon: FolderOpen },
  { href: '/admin/qa', label: 'Q&A', icon: MessageSquare },
  { href: '/admin/activity', label: 'Activity', icon: Activity },
  { href: '/admin/cap-table', label: 'Cap Table', icon: PieChart },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

interface AdminSidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => { onClose?.() }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 w-64 h-screen bg-inf-obsidian border-r border-white/10 flex flex-col overflow-hidden z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:z-30`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link href="/admin" className="block transition-opacity hover:opacity-80">
            <img src="/influunt-lockup-dark.png" alt="Influunt" width={140} />
          </Link>
          <button onClick={onClose} className="md:hidden text-white/60 hover:text-white p-1 rounded-inf hover:bg-white/[0.06] transition-colors">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Administration
          </p>
          <div className="space-y-0.5">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-inf text-sm transition-all duration-200 min-h-[44px] ${
                    active
                      ? 'bg-inf-gold/[0.12] text-inf-gold font-medium'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full bg-gradient-to-b from-inf-gold-display to-inf-gold transition-all duration-300 ${
                      active ? 'h-5 opacity-100' : 'h-0 opacity-0'
                    }`}
                  />
                  <Icon size={16} className={`transition-colors ${active ? 'text-inf-gold' : 'text-white/50 group-hover:text-white'}`} />
                  {label}
                </Link>
              )
            })}
          </div>
        </nav>
        <div className="px-3 py-3 border-t border-white/10 space-y-2">
          <Link
            href="/room"
            className="block w-full text-center text-[13px] text-inf-gold border border-inf-gold/50 rounded-inf py-2 hover:bg-inf-gold/10 hover:border-inf-gold transition-all duration-200"
          >
            View as investor &rarr;
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-white/60 hover:text-white rounded-inf hover:bg-white/[0.06] transition-colors min-h-[44px]"
          >
            <LogOut size={14} />
            Sign out
          </button>

        </div>
      </aside>
    </>
  )
}
