import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { InvestorSidebar } from '@/components/layout/InvestorSidebar'
import { Header } from '@/components/layout/Header'

export default async function RoomLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const admin = createAdminClient()
    const { data: investor } = await admin
      .from('investors')
      .select('is_admin')
      .eq('auth_user_id', user.id)
      .single()
    isAdmin = investor?.is_admin ?? false
  }

  return (
    <div className="min-h-screen bg-brand-darker">
      <InvestorSidebar isAdmin={isAdmin} />
      <div className="ml-60 flex flex-col min-h-screen">
        <Header title="Data Room" subtitle="Influunt — Seed Round $5M" />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
