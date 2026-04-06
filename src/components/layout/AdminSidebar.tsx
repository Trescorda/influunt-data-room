'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Activity,
  Settings,
  MessageSquare,
  PieChart,
  HelpCircle,
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

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-brand-dark border-r border-brand-border flex flex-col overflow-hidden z-30">
      <div className="px-6 py-6 border-b border-brand-border">
        <Link href="/admin" className="block">
          <img src="/influunt-horizontal.png" alt="Influunt" width={140} />
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-brand-gold/10 text-brand-gold'
                  : 'text-brand-muted hover:text-brand-text hover:bg-brand-card'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-4 border-t border-brand-border flex justify-center">
        <Link
          href="/room"
          className="block text-center text-sm text-brand-gold border border-brand-gold rounded-lg px-4 py-2.5 hover:bg-brand-gold/10 transition-colors"
          style={{ fontSize: '14px', padding: '10px 16px', borderRadius: '8px' }}
        >
          View as investor &rarr;
        </Link>
      </div>
    </aside>
  )
}
