'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  DollarSign,
  Calendar,
  PieChart,
  HelpCircle,
} from 'lucide-react'

const navItems = [
  { href: '/room', label: 'Data Room', icon: LayoutDashboard },
  { href: '/room/invest', label: 'Invest', icon: DollarSign },
  { href: '/room/book-a-call', label: 'Book a Call', icon: Calendar },
  { href: '/room/cap-table', label: 'Cap Table', icon: PieChart },
  { href: '/room/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/room/qa', label: 'Q&A', icon: MessageSquare },
]

interface InvestorSidebarProps {
  isAdmin?: boolean
}

export function InvestorSidebar({ isAdmin }: InvestorSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-brand-dark border-r border-brand-border flex flex-col">
      <div className="px-6 py-6 border-b border-brand-border">
        <Link href="/room" className="block">
          <img src="/influunt-horizontal.png" alt="Influunt" width={140} />
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
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
      <div className="px-4 py-4 border-t border-brand-border space-y-3">
        {isAdmin && (
          <div className="flex justify-center">
            <Link
              href="/admin"
              className="block text-center text-sm text-brand-gold border border-brand-gold rounded-lg hover:bg-brand-gold/10 transition-colors"
              style={{ fontSize: '14px', padding: '10px 16px', borderRadius: '8px' }}
            >
              View as admin &rarr;
            </Link>
          </div>
        )}
        <p className="text-xs text-brand-muted text-center">Confidential — Do not distribute</p>
      </div>
    </aside>
  )
}
