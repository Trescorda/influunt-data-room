'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  DollarSign,
  Calendar,
  PieChart,
  HelpCircle,
  Compass,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/room/journey', label: 'The Journey', icon: Compass },
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
        <div className="fixed inset-0 bg-inf-green/25 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 w-52 h-screen bg-white border-r border-inf-line flex flex-col overflow-hidden z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:z-30`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-inf-line">
          <Link href="/room" className="block transition-opacity hover:opacity-70">
            <img src="/influunt-lockup-light.png" alt="Influunt" width={112} />
          </Link>
          <button onClick={onClose} className="md:hidden text-inf-muted hover:text-inf-green p-1 rounded-inf hover:bg-inf-green/[0.06] transition-colors">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 px-2.5 py-4 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-inf-green/40">
            Investor Room
          </p>
          <div className="space-y-0.5">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-inf text-[13px] transition-all duration-200 min-h-[44px] ${
                    active
                      ? 'bg-inf-gold/[0.12] text-inf-gold-deep font-semibold'
                      : 'text-inf-muted hover:text-inf-green hover:bg-inf-green/[0.05]'
                  }`}
                >
                  {/* Active indicator rail */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full bg-inf-gold transition-all duration-300 ${
                      active ? 'h-5 opacity-100' : 'h-0 opacity-0'
                    }`}
                  />
                  <Icon size={16} className={`flex-none transition-colors ${active ? 'text-inf-gold' : 'text-inf-green/40 group-hover:text-inf-green/70'}`} />
                  {label}
                </Link>
              )
            })}
          </div>
        </nav>
        <div className="px-2.5 py-3 border-t border-inf-line space-y-2">
          {isAdmin && (
            <Link
              href="/admin"
              className="block w-full text-center text-[12px] font-medium text-inf-gold-deep border border-inf-gold/40 rounded-inf py-2 hover:bg-inf-gold/[0.08] hover:border-inf-gold/70 transition-all duration-200"
            >
              View as admin &rarr;
            </Link>
          )}

        </div>
      </aside>
    </>
  )
}
