'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [resetSent, setResetSent] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

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

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })

    if (authError) {
      console.error('Sign in error:', authError.message, authError)
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    await fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login' }),
    })

    const { data: { user } } = await supabase.auth.getUser()
    const redirectRes = await fetch('/api/auth-redirect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id }),
    })
    const { redirectTo } = await redirectRes.json()

    window.location.href = redirectTo || '/nda'
  }

  // IMPORTANT: Add https://invest.influunt.global/auth/reset to
  // Supabase Dashboard > Authentication > URL Configuration > Redirect URLs
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
      redirectTo: 'https://invest.influunt.global/auth/reset',
    })

    setLoading(false)
    setResetSent(true)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-inf-obsidian inf-on-dark">
      {/* Ambient gold bloom behind the card */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[33%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-inf-gold/10 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <img src="/influunt-lockup-dark.png" alt="Influunt" width={180} className="mx-auto" />
          <p className="text-[13px] text-white/50 mt-3 uppercase tracking-[0.18em]">Investor Data Room</p>
        </div>

        <div className="bg-inf-dark-card/80 backdrop-blur-sm border border-inf-gold/20 rounded-inf-panel shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] p-8">
          {mode === 'forgot' ? (
            resetSent ? (
              <div className="text-center py-4">
                <h2 className="text-lg font-semibold text-white mb-2">Check your email</h2>
                <p className="text-sm text-white/60">
                  If an account exists with that email, you&apos;ll receive a reset link shortly.
                </p>
                <button
                  onClick={() => { setMode('login'); setResetSent(false); setError('') }}
                  className="text-sm text-inf-gold hover:text-inf-gold-display mt-4 transition-colors"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="text-center mb-2">
                  <h2 className="text-lg font-semibold text-white">Reset password</h2>
                  <p className="text-sm text-white/60 mt-1">
                    Enter your email and we&apos;ll send you a reset link
                  </p>
                </div>
                <Input
                  onDark
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                <Button type="submit" loading={loading} className="w-full" size="lg">
                  Send reset link
                </Button>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError('') }}
                  className="block w-full text-center text-sm text-inf-gold hover:text-inf-gold-display transition-colors"
                >
                  Back to sign in
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-center mb-2">
                <h2 className="text-lg font-semibold text-white">Welcome</h2>
                <p className="text-sm text-white/60 mt-1">
                  Sign in to access the data room
                </p>
              </div>
              <Input
                onDark
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                onDark
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-sm text-red-400 text-center">{error}</p>}
              <Button type="submit" loading={loading} className="w-full" size="lg">
                Sign in
              </Button>
              <button
                type="button"
                onClick={() => { setMode('forgot'); setError('') }}
                className="block w-full text-center text-sm text-inf-gold hover:text-inf-gold-display transition-colors"
              >
                Forgot password?
              </button>
              <p className="text-xs text-white/50 text-center">
                Access is by invitation only. Contact your Influunt representative if you need an invite.
              </p>
            </form>
          )}
        </div>

        <p className="text-xs text-white/40 text-center mt-6">
          &copy; {new Date().getFullYear()} Influunt Pty Ltd. All rights reserved.
        </p>
      </div>
    </div>
  )
}
