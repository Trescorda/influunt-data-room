'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Check, Lock } from 'lucide-react'

/** Auth-surface panel — dark card on the obsidian ground. */
const panel =
  'bg-white border border-inf-line rounded-inf-panel shadow-[0_24px_48px_-12px_rgba(23,65,51,0.14)] p-8'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 12) {
      setError('Password must be at least 12 characters')
      return
    }
    if (!/\d/.test(password)) {
      setError('Password must contain at least one number')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, password }),
    })
    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setSuccess(true)
    } else {
      setError(data.error || 'Failed to set password')
    }
  }

  if (!token || !email) {
    return (
      <div className={panel}>
        <p className="text-sm text-red-600 text-center">Invalid password reset link.</p>
        <p className="text-xs text-inf-muted text-center mt-2">Contact brad@influunt.global for assistance.</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className={panel}>
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={24} className="text-green-400" />
          </div>
          <h2 className="text-lg font-semibold text-inf-green mb-2">Password set</h2>
          <p className="text-sm text-inf-muted mb-4">Your password has been set. You can now sign in.</p>
          <a
            href="/login"
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-inf-gold text-white font-semibold rounded-inf hover:bg-inf-gold-hover transition-colors"
          >
            Sign in
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={panel}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-2">
          <div className="w-12 h-12 bg-inf-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={20} className="text-inf-gold" />
          </div>
          <h2 className="text-lg font-semibold text-inf-green">Set your password</h2>
          <p className="text-sm text-inf-muted mt-1">
            Choose a password for <span className="text-inf-gold">{email}</span>
          </p>
        </div>
        <Input
          type="password"
          label="Password"
          placeholder="Minimum 12 characters, must include a number"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          label="Confirm password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Set password
        </Button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-inf-paper">
      {/* Ambient gold bloom behind the card */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[33%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-inf-gold/10 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <img src="/influunt-lockup-light.png" alt="Influunt" width={180} className="mx-auto" />
          <p className="text-[13px] text-inf-muted mt-3 uppercase tracking-[0.18em]">Investor Data Room</p>
        </div>
        <Suspense fallback={<div className="text-center text-inf-muted text-sm">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
