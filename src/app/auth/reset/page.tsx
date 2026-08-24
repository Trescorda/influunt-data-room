'use client'

// IMPORTANT: Add https://invest.influunt.global/auth/reset to
// Supabase Dashboard > Authentication > URL Configuration > Redirect URLs

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Check, Lock, Loader2 } from 'lucide-react'

export default function ResetPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionValid, setSessionValid] = useState(false)
  const supabase = createClient()

  // Supabase automatically picks up the recovery token from the URL hash
  // and creates a session. We just need to wait for it.
  useEffect(() => {
    const checkSession = async () => {
      // Small delay to let Supabase process the hash token
      await new Promise((r) => setTimeout(r, 1000))
      const { data: { user } } = await supabase.auth.getUser()
      setSessionValid(!!user)
      setChecking(false)
    }
    checkSession()
  }, [])

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

    const { error: updateError } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-inf-paper flex items-center justify-center p-4">
        <Loader2 className="animate-spin text-inf-gold" size={32} />
      </div>
    )
  }

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

        <div className="bg-white border border-inf-line rounded-inf-panel shadow-[0_24px_48px_-12px_rgba(23,65,51,0.14)] p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-inf-green mb-2">Password updated</h2>
              <p className="text-sm text-inf-muted mb-4">Your password has been updated successfully.</p>
              <a
                href="/login"
                className="inline-flex items-center justify-center w-full px-4 py-3 bg-inf-gold text-white font-semibold rounded-inf hover:bg-inf-gold-hover transition-colors"
              >
                Sign in
              </a>
            </div>
          ) : !sessionValid ? (
            <div className="text-center py-4">
              <p className="text-sm text-red-600 mb-2">Invalid or expired reset link.</p>
              <p className="text-xs text-inf-muted">
                Please request a new password reset from the{' '}
                <a href="/login" className="text-inf-gold hover:text-inf-gold-hover transition-colors">login page</a>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-2">
                <div className="w-12 h-12 bg-inf-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock size={20} className="text-inf-gold" />
                </div>
                <h2 className="text-lg font-semibold text-inf-green">Set new password</h2>
                <p className="text-sm text-inf-muted mt-1">Choose a new password for your account</p>
              </div>
              <Input
                type="password"
                label="New password"
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
                Update password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
