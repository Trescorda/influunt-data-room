'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { InviteModal } from '@/components/investors/InviteModal'
import { Modal } from '@/components/ui/Modal'
import { UserPlus, Link2, Check, Trash2 } from 'lucide-react'
import type { Investor } from '@/lib/types'

const statusVariant: Record<string, 'gold' | 'green' | 'red' | 'gray' | 'blue'> = {
  invited: 'blue',
  active: 'green',
  suspended: 'red',
  expired: 'gray',
}

const typeLabels: Record<string, string> = {
  individual: 'Individual',
  family_office: 'Family Office',
  vc_fund: 'VC Fund',
  syndicate: 'Syndicate',
  sovereign: 'Sovereign',
  corporate: 'Corporate',
  other: 'Other',
}

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
  const [generatingLink, setGeneratingLink] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Investor | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadInvestors = async () => {
    const res = await fetch('/api/admin/documents') // reuse admin auth check
    // Actually fetch investors via a dedicated call
    const investorRes = await fetch('/api/admin/investors')
    const data = await investorRes.json()
    setInvestors(data.investors || [])
    setLoading(false)
  }

  useEffect(() => {
    fetch('/api/admin/investors')
      .then((r) => r.json())
      .then((d) => { setInvestors(d.investors || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleInvite = async (data: {
    name: string
    email: string
    organisation: string
    investor_type: string
  }) => {
    const res = await fetch('/api/admin/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await res.json()

    if (!res.ok) {
      alert(result.error || 'Failed to invite')
      return
    }

    if (result.inviteLink) {
      await navigator.clipboard.writeText(result.inviteLink)
      alert('Investor created! Invite link copied to clipboard.')
    }

    // Reload investors
    const reloadRes = await fetch('/api/admin/investors')
    const reloadData = await reloadRes.json()
    setInvestors(reloadData.investors || [])
  }

  const handleCopyLink = async (email: string) => {
    setGeneratingLink(email)
    const res = await fetch(`/api/admin/invite?email=${encodeURIComponent(email)}`)
    const data = await res.json()
    setGeneratingLink(null)

    if (data.inviteLink) {
      await navigator.clipboard.writeText(data.inviteLink)
      setCopiedEmail(email)
      setTimeout(() => setCopiedEmail(null), 2000)
    } else {
      alert(data.error || 'Failed to generate link')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    await fetch('/api/admin/investors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ investorId: deleteTarget.id, authUserId: deleteTarget.auth_user_id }),
    })

    setDeleteTarget(null)
    setDeleting(false)

    const reloadRes = await fetch('/api/admin/investors')
    const reloadData = await reloadRes.json()
    setInvestors(reloadData.investors || [])
  }

  return (
    <div className="px-8 py-6">
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
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Organisation</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">NDA</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Invited</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {investors.map((inv) => (
                  <tr key={inv.id} className="border-b border-brand-border hover:bg-brand-card/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-brand-text">{inv.name}</p>
                      <p className="text-xs text-brand-muted">{inv.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-muted">{inv.organisation || '—'}</td>
                    <td className="px-4 py-3 text-xs text-brand-muted">{typeLabels[inv.investor_type] || inv.investor_type}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[inv.status] || 'gray'}>{inv.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {inv.nda_signed ? <Badge variant="green">Signed</Badge> : <Badge variant="gray">Pending</Badge>}
                    </td>
                    <td className="px-4 py-3 text-xs text-brand-muted">{new Date(inv.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleCopyLink(inv.email)}
                          disabled={generatingLink === inv.email}
                          className="inline-flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-gold/80 transition-colors disabled:opacity-50"
                          title="Copy invite/password reset link"
                        >
                          {copiedEmail === inv.email ? (
                            <><Check size={13} /> Copied!</>
                          ) : generatingLink === inv.email ? (
                            <>Generating...</>
                          ) : (
                            <><Link2 size={13} /> Copy link</>
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(inv)}
                          className="text-[#666] hover:text-red-500 transition-colors"
                          title="Remove investor"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
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

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove investor">
        <p className="text-sm text-brand-muted mb-4">
          Remove investor? This will revoke access for{' '}
          <span className="text-brand-text font-medium">{deleteTarget?.name}</span>{' '}
          (<span className="text-brand-muted">{deleteTarget?.email}</span>).
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete} className="flex-1">
            Remove
          </Button>
        </div>
      </Modal>
    </div>
  )
}
