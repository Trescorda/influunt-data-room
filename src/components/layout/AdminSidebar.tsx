'use client'

import { useState, useEffect } from 'react'
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
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 w-64 h-screen bg-brand-dark border-r border-brand-border flex flex-col overflow-hidden z-50 transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:z-30`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
          <Link href="/admin" className="block">
            <img src="/influunt-horizontal.png" alt="Influunt" width={140} />
          </Link>
          <button onClick={onClose} className="md:hidden text-brand-muted hover:text-brand-text">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] ${
                  active
                    ? 'bg-brand-gold/10 text-brand-gold'
                    : 'text-brand-muted hover:text-brand-text hover:bg-brand-card'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="px-3 py-3 border-t border-brand-border space-y-2">
          <Link
            href="/room"
            className="block w-full text-center text-[13px] text-brand-gold border border-brand-gold rounded-lg py-2 hover:bg-brand-gold/10 transition-colors"
          >
            View as investor &rarr;
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-brand-muted hover:text-brand-text rounded-lg hover:bg-brand-card transition-colors min-h-[44px]"
          >
            <LogOut size={14} />
            Sign out
          </button>
          <p className="text-[10px] text-brand-muted text-center">Confidential — Do not distribute</p>
        </div>
      </aside>
    </>
  )
}
