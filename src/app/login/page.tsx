'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Lock, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Check if email exists in investors table (server-side, bypasses RLS)
    const res = await fetch('/api/check-investor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    })
    const { exists } = await res.json()

    if (!exists) {
      setError('This email is not authorized to access the data room.')
      setLoading(false)
      return
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        shouldCreateUser: false,
      },
    })

    if (authError) {
      console.error('Supabase signInWithOtp error:', authError.message, authError)
      setError(`Failed to send code: ${authError.message}`)
      setLoading(false)
      return
    }

    setStep('code')
    setLoading(false)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.toLowerCase().trim(),
      token: otpCode.trim(),
      type: 'email',
    })

    if (verifyError) {
      console.error('Supabase verifyOtp error:', verifyError.message, verifyError)
      setError(`Invalid code: ${verifyError.message}`)
      setLoading(false)
      return
    }

    // Session is now set — check where to redirect
    const redirectRes = await fetch('/api/auth-redirect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: (await supabase.auth.getUser()).data.user?.id }),
    })
    const { redirectTo } = await redirectRes.json()

    router.replace(redirectTo || '/nda')
  }

  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/influunt-logo.png" alt="Influunt" width={180} className="mx-auto" />
          <p className="text-sm text-brand-muted mt-2">Investor Data Room</p>
        </div>

        <Card padding="lg">
          {step === 'code' ? (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="text-center mb-2">
                <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={20} className="text-brand-gold" />
                </div>
                <h2 className="text-lg font-semibold text-brand-text">Enter your code</h2>
                <p className="text-sm text-brand-muted mt-1">
                  We sent a 6-digit code to{' '}
                  <span className="text-brand-gold">{email}</span>
                </p>
              </div>
              <Input
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-[0.5em] font-mono"
                maxLength={6}
                autoFocus
                required
              />
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}
              <Button type="submit" loading={loading} disabled={otpCode.length !== 6} className="w-full" size="lg">
                Verify & enter
              </Button>
              <p className="text-xs text-brand-muted text-center">
                Check your spam folder if you don&apos;t see the email.
              </p>
              <button
                type="button"
                onClick={() => { setStep('email'); setOtpCode(''); setError('') }}
                className="flex items-center gap-1 text-sm text-brand-gold hover:text-brand-gold/80 mx-auto transition-colors"
              >
                <ArrowLeft size={14} />
                Use a different email
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="text-center mb-2">
                <h2 className="text-lg font-semibold text-brand-text">Welcome</h2>
                <p className="text-sm text-brand-muted mt-1">
                  Enter your email to access the data room
                </p>
              </div>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}
              <Button type="submit" loading={loading} className="w-full" size="lg">
                Send access code
              </Button>
              <p className="text-xs text-brand-muted text-center">
                Access is by invitation only. Contact your Influunt representative if you need an invite.
              </p>
            </form>
          )}
        </Card>

        <p className="text-xs text-brand-muted text-center mt-6">
          &copy; {new Date().getFullYear()} Influunt Pty Ltd. All rights reserved.
        </p>
      </div>
    </div>
  )
}
