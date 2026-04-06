'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  DollarSign,
  Calendar,
  PieChart,
  HelpCircle,
  X,
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
  mobileOpen?: boolean
  onClose?: () => void
}

export function InvestorSidebar({ isAdmin, mobileOpen, onClose }: InvestorSidebarProps) {
  const pathname = usePathname()

  // Close on route change
  useEffect(() => {
    onClose?.()
  }, [pathname])

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 w-60 h-screen bg-brand-dark border-r border-brand-border flex flex-col overflow-hidden z-50 transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:z-30`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <Link href="/room" className="block">
            <img src="/influunt-horizontal.png" alt="Influunt" width={130} />
          </Link>
          <button onClick={onClose} className="md:hidden text-brand-muted hover:text-brand-text">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
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
          {isAdmin && (
            <Link
              href="/admin"
              className="block w-full text-center text-[13px] text-brand-gold border border-brand-gold rounded-lg py-2 hover:bg-brand-gold/10 transition-colors"
            >
              View as admin &rarr;
            </Link>
          )}

        </div>
      </aside>
    </>
  )
}
