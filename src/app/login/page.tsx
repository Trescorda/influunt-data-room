'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
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

    // Session is now set — check where to redirect
    const { data: { user } } = await supabase.auth.getUser()
    const redirectRes = await fetch('/api/auth-redirect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id }),
    })
    const { redirectTo } = await redirectRes.json()

    // Hard redirect so the browser sends fresh cookies to middleware
    window.location.href = redirectTo || '/nda'
  }

  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/influunt-logo.png" alt="Influunt" width={180} className="mx-auto" />
          <p className="text-sm text-brand-muted mt-2">Investor Data Room</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-lg font-semibold text-brand-text">Welcome</h2>
              <p className="text-sm text-brand-muted mt-1">
                Sign in to access the data room
              </p>
            </div>
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign in
            </Button>
            <p className="text-xs text-brand-muted text-center">
              Access is by invitation only. Contact your Influunt representative if you need an invite.
            </p>
          </form>
        </Card>

        <p className="text-xs text-brand-muted text-center mt-6">
          &copy; {new Date().getFullYear()} Influunt Pty Ltd. All rights reserved.
        </p>
      </div>
    </div>
  )
}
