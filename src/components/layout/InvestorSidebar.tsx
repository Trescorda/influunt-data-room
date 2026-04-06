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
    <aside className="fixed top-0 left-0 w-60 h-screen bg-brand-dark border-r border-brand-border flex flex-col overflow-hidden z-30">
      <div className="px-5 py-4 border-b border-brand-border">
        <Link href="/room" className="block">
          <img src="/influunt-horizontal.png" alt="Influunt" width={130} />
        </Link>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
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
        {isAdmin && (
          <div className="flex justify-center">
            <Link
              href="/admin"
              className="block w-full text-center text-[13px] text-brand-gold border border-brand-gold rounded-lg py-2 hover:bg-brand-gold/10 transition-colors"
            >
              View as admin &rarr;
            </Link>
          </div>
        )}
        <p className="text-[10px] text-brand-muted text-center">Confidential — Do not distribute</p>
      </div>
    </aside>
  )
}
