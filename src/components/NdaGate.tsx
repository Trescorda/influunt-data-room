'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface NdaGateProps {
  ndaText: string
  investorId: string
}

export function NdaGate({ ndaText, investorId }: NdaGateProps) {
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAccept = async () => {
    setLoading(true)
    try {
      await supabase
        .from('investors')
        .update({ nda_signed: true, nda_signed_at: new Date().toISOString() })
        .eq('id', investorId)

      await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sign_nda' }),
      })

      window.location.href = '/room'
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <img src="/influunt-logo.png" alt="Influunt" width={180} className="mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-brand-gold">Non-Disclosure Agreement</h1>
          <p className="text-sm text-brand-muted mt-2">
            Please review and accept to access the data room
          </p>
        </div>
        <Card padding="lg">
          <div className="max-h-64 overflow-y-auto mb-6 pr-2">
            <p className="text-sm text-brand-text/80 leading-relaxed whitespace-pre-wrap">
              {ndaText}
            </p>
          </div>
          <div className="border-t border-brand-border pt-4">
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-brand-border bg-brand-dark accent-brand-gold"
              />
              <span className="text-sm text-brand-text">
                I have read and agree to the terms of this Non-Disclosure Agreement
              </span>
            </label>
            <Button
              onClick={handleAccept}
              disabled={!agreed}
              loading={loading}
              className="w-full"
              size="lg"
            >
              Enter data room
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
