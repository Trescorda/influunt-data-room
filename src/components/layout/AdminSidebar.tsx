'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Activity,
  Settings,
  MessageSquare,
  PieChart,
  HelpCircle,
  LogOut,
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

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-brand-dark border-r border-brand-border flex flex-col overflow-hidden z-30">
      <div className="px-6 py-5 border-b border-brand-border">
        <Link href="/admin" className="block">
          <img src="/influunt-horizontal.png" alt="Influunt" width={140} />
        </Link>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
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
        <div className="flex justify-center">
          <Link
            href="/room"
            className="block w-full text-center text-[13px] text-brand-gold border border-brand-gold rounded-lg py-2 hover:bg-brand-gold/10 transition-colors"
          >
            View as investor &rarr;
          </Link>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-brand-muted hover:text-brand-text rounded-lg hover:bg-brand-card transition-colors"
        >
          <LogOut size={14} />
          Sign out
        </button>
        <p className="text-[10px] text-brand-muted text-center">Confidential — Do not distribute</p>
      </div>
    </aside>
  )
}
