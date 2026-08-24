'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

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
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-inf-paper">
      {/* Ambient gold bloom behind the card */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[33%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-inf-gold/10 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-2xl animate-fade-up">
        <div className="text-center mb-8">
          <img src="/influunt-lockup-light.png" alt="Influunt" width={180} className="mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-inf-green">Non-Disclosure Agreement</h1>
          <p className="text-sm text-inf-muted mt-2">
            Please review and accept to access the data room
          </p>
        </div>
        <div className="bg-white border border-inf-line rounded-inf-panel shadow-[0_24px_48px_-12px_rgba(23,65,51,0.14)] p-8">
          <div className="max-h-64 overflow-y-auto mb-6 pr-2">
            <p className="text-sm text-inf-body leading-relaxed whitespace-pre-wrap">
              {ndaText}
            </p>
          </div>
          <div className="border-t border-inf-line pt-4">
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-inf-line-strong bg-white accent-inf-gold"
              />
              <span className="text-sm text-inf-body">
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
        </div>
      </div>
    </div>
  )
}
