'use client'

// IMPORTANT: Add https://invest.influunt.global/auth/reset to
// Supabase Dashboard > Authentication > URL Configuration > Redirect URLs

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
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

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
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
      <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4">
        <Loader2 className="animate-spin text-brand-gold" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/influunt-logo.png" alt="Influunt" width={180} className="mx-auto" />
          <p className="text-sm text-brand-muted mt-2">Investor Data Room</p>
        </div>

        <Card padding="lg">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-brand-text mb-2">Password updated</h2>
              <p className="text-sm text-brand-muted mb-4">Your password has been updated successfully.</p>
              <a
                href="/login"
                className="inline-flex items-center justify-center w-full px-4 py-3 bg-brand-gold text-brand-darker font-semibold rounded-lg hover:bg-brand-gold/90 transition-colors"
              >
                Sign in
              </a>
            </div>
          ) : !sessionValid ? (
            <div className="text-center py-4">
              <p className="text-sm text-red-400 mb-2">Invalid or expired reset link.</p>
              <p className="text-xs text-brand-muted">
                Please request a new password reset from the{' '}
                <a href="/login" className="text-brand-gold hover:text-brand-gold/80">login page</a>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-2">
                <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock size={20} className="text-brand-gold" />
                </div>
                <h2 className="text-lg font-semibold text-brand-text">Set new password</h2>
                <p className="text-sm text-brand-muted mt-1">Choose a new password for your account</p>
              </div>
              <Input
                type="password"
                label="New password"
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
                Update password
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
