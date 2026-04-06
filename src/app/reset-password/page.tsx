'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Check, Lock } from 'lucide-react'

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

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
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
      <Card padding="lg">
        <p className="text-sm text-red-400 text-center">Invalid password reset link.</p>
        <p className="text-xs text-brand-muted text-center mt-2">Contact brad@influunt.global for assistance.</p>
      </Card>
    )
  }

  if (success) {
    return (
      <Card padding="lg">
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={24} className="text-green-400" />
          </div>
          <h2 className="text-lg font-semibold text-brand-text mb-2">Password set</h2>
          <p className="text-sm text-brand-muted mb-4">Your password has been set. You can now sign in.</p>
          <a
            href="/login"
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-brand-gold text-brand-darker font-semibold rounded-lg hover:bg-brand-gold/90 transition-colors"
          >
            Sign in
          </a>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-2">
          <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={20} className="text-brand-gold" />
          </div>
          <h2 className="text-lg font-semibold text-brand-text">Set your password</h2>
          <p className="text-sm text-brand-muted mt-1">
            Choose a password for <span className="text-brand-gold">{email}</span>
          </p>
        </div>
        <Input
          type="password"
          label="Password"
          placeholder="Minimum 6 characters"
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
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Set password
        </Button>
      </form>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/influunt-logo.png" alt="Influunt" width={180} className="mx-auto" />
          <p className="text-sm text-brand-muted mt-2">Investor Data Room</p>
        </div>
        <Suspense fallback={<div className="text-center text-brand-muted text-sm">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
