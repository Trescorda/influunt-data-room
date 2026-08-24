'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface InviteModalProps {
  open: boolean
  onClose: () => void
  onInvite: (data: {
    name: string
    email: string
    organisation: string
    investor_type: string
  }) => Promise<void>
}

export function InviteModal({ open, onClose, onInvite }: InviteModalProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [investorType, setInvestorType] = useState('individual')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onInvite({ name, email, organisation, investor_type: investorType })
      setName('')
      setEmail('')
      setOrganisation('')
      setInvestorType('individual')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Invite investor">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Smith"
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          required
        />
        <Input
          label="Organisation"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
          placeholder="Acme Capital"
        />
        <div className="space-y-1.5">
          <label className="inf-label block">Investor type</label>
          <select
            value={investorType}
            onChange={(e) => setInvestorType(e.target.value)}
            className="w-full text-sm"
          >
            <option value="individual">Individual</option>
            <option value="family_office">Family Office</option>
            <option value="vc_fund">VC Fund</option>
            <option value="syndicate">Syndicate</option>
            <option value="sovereign">Sovereign</option>
            <option value="corporate">Corporate</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Send invite
          </Button>
        </div>
      </form>
    </Modal>
  )
}
