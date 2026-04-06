'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { InvestorRow } from '@/components/investors/InvestorRow'
import { InviteModal } from '@/components/investors/InviteModal'
import { UserPlus } from 'lucide-react'
import type { Investor } from '@/lib/types'

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadInvestors = async () => {
    const { data } = await supabase
      .from('investors')
      .select('*')
      .eq('is_admin', false)
      .order('created_at', { ascending: false })
    setInvestors(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadInvestors()
  }, [])

  const handleInvite = async (data: {
    name: string
    email: string
    organisation: string
    investor_type: string
  }) => {
    const { error } = await supabase.from('investors').insert({
      name: data.name,
      email: data.email.toLowerCase().trim(),
      organisation: data.organisation || null,
      investor_type: data.investor_type,
      status: 'invited',
    })

    if (error) {
      alert(error.message)
      return
    }

    // Send OTP code to invite the investor
    await supabase.auth.signInWithOtp({
      email: data.email.toLowerCase().trim(),
      options: {
        shouldCreateUser: true,
        data: { invited: true },
      },
    })

    await loadInvestors()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-brand-text">Investors</h1>
          <p className="text-sm text-brand-muted mt-1">
            Manage investor access and invitations
          </p>
        </div>
        <Button onClick={() => setShowInvite(true)}>
          <UserPlus size={16} className="mr-2" />
          Invite investor
        </Button>
      </div>

      <Card padding="sm">
        {loading ? (
          <div className="py-12 text-center text-brand-muted text-sm">Loading...</div>
        ) : investors.length === 0 ? (
          <div className="py-12 text-center text-brand-muted text-sm">
            No investors yet. Invite your first investor to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                    Organisation
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                    NDA
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                    Invited
                  </th>
                </tr>
              </thead>
              <tbody>
                {investors.map((investor) => (
                  <InvestorRow key={investor.id} investor={investor} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <InviteModal
        open={showInvite}
        onClose={() => setShowInvite(false)}
        onInvite={handleInvite}
      />
    </div>
  )
}
