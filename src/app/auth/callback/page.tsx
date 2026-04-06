'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      // Implicit flow: Supabase client auto-detects the hash fragment
      // and sets the session. We just need to wait for it.
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        console.error('Auth callback error:', error?.message)
        router.replace('/login?error=auth')
        return
      }

      // Check investor status to determine redirect
      const res = await fetch('/api/auth-redirect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      })
      const { redirectTo } = await res.json()

      router.replace(redirectTo || '/nda')
    }

    handleCallback()
  }, [])

  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-brand-muted">Signing you in...</p>
      </div>
    </div>
  )
}
