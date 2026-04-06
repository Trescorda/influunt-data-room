'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { InviteModal } from '@/components/investors/InviteModal'
import { UserPlus, Key, Check, Trash2, Copy } from 'lucide-react'
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
  const [deleteTarget, setDeleteTarget] = useState<Investor | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [passwordTarget, setPasswordTarget] = useState<Investor | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [settingPassword, setSettingPassword] = useState(false)
  const [passwordSet, setPasswordSet] = useState(false)
  const [copiedCreds, setCopiedCreds] = useState(false)

  const loadInvestors = async () => {
    const res = await fetch('/api/admin/investors')
    const data = await res.json()
    setInvestors(data.investors || [])
    setLoading(false)
  }

  useEffect(() => { loadInvestors() }, [])

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

    loadInvestors()
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
    loadInvestors()
  }

  const handleSetPassword = async () => {
    if (!passwordTarget || !newPassword) return
    setSettingPassword(true)

    const res = await fetch('/api/admin/invite', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: passwordTarget.email, password: newPassword }),
    })
    const result = await res.json()

    setSettingPassword(false)

    if (res.ok) {
      setPasswordSet(true)
    } else {
      alert(result.error || 'Failed to set password')
    }
  }

  const handleCopyCredentials = async () => {
    if (!passwordTarget) return
    const loginUrl = 'https://invest.influunt.global/login'
    const text = `Influunt Data Room Access\n\nLogin: ${loginUrl}\nEmail: ${passwordTarget.email}\nPassword: ${newPassword}`
    await navigator.clipboard.writeText(text)
    setCopiedCreds(true)
    setTimeout(() => setCopiedCreds(false), 2000)
  }

  const closePasswordModal = () => {
    setPasswordTarget(null)
    setNewPassword('')
    setPasswordSet(false)
    setCopiedCreds(false)
  }

  return (
    <div className="px-4 md:px-8 py-4 md:py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-brand-text">Investors</h1>
          <p className="text-sm text-brand-muted mt-1">Manage investor access and invitations</p>
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
                          onClick={() => setPasswordTarget(inv)}
                          className="inline-flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-gold/80 transition-colors"
                          title="Set password & copy credentials"
                        >
                          <Key size={13} />
                          Set password
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

      {/* Set Password Modal */}
      <Modal open={!!passwordTarget} onClose={closePasswordModal} title="Set Investor Password">
        {passwordSet ? (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check size={20} className="text-green-400" />
              </div>
              <p className="text-sm text-brand-text font-medium">Password set successfully</p>
              <p className="text-xs text-brand-muted mt-1">Copy the credentials below and send to the investor</p>
            </div>
            <div className="bg-brand-dark rounded-lg p-4 text-sm space-y-1">
              <p className="text-brand-muted">Login: <span className="text-brand-text">invest.influunt.global/login</span></p>
              <p className="text-brand-muted">Email: <span className="text-brand-text">{passwordTarget?.email}</span></p>
              <p className="text-brand-muted">Password: <span className="text-brand-gold font-mono">{newPassword}</span></p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={closePasswordModal} className="flex-1">
                Done
              </Button>
              <Button onClick={handleCopyCredentials} className="flex-1">
                <Copy size={14} className="mr-2" />
                {copiedCreds ? 'Copied!' : 'Copy credentials'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-brand-muted">
              Set a login password for <span className="text-brand-text font-medium">{passwordTarget?.name}</span> ({passwordTarget?.email})
            </p>
            <Input
              label="Password"
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter a secure password"
            />
            <div className="flex gap-3">
              <Button variant="secondary" onClick={closePasswordModal} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSetPassword} loading={settingPassword} disabled={newPassword.length < 6} className="flex-1">
                Set password
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
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
