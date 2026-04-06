import { InvestorSidebar } from '@/components/layout/InvestorSidebar'
import { Header } from '@/components/layout/Header'

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-darker">
      <InvestorSidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Data Room" subtitle="Influunt — Seed Round $5M" />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
