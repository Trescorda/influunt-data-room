'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Check if email exists in investors table
    const { data: investor } = await supabase
      .from('investors')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (!investor) {
      setError('This email is not authorized to access the data room.')
      setLoading(false)
      return
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      setError('Failed to send access link. Please try again.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-brand-gold tracking-wide">Influunt</h1>
          <p className="text-sm text-brand-muted mt-2">Investor Data Room</p>
        </div>

        <Card padding="lg">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={20} className="text-brand-gold" />
              </div>
              <h2 className="text-lg font-semibold text-brand-text mb-2">Check your email</h2>
              <p className="text-sm text-brand-muted">
                We&apos;ve sent a secure access link to{' '}
                <span className="text-brand-gold">{email}</span>
              </p>
              <p className="text-xs text-brand-muted mt-4">
                The link will expire in 1 hour. Check your spam folder if you don&apos;t see it.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="text-sm text-brand-gold hover:text-brand-gold/80 mt-4 transition-colors"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
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
                Send access link
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
