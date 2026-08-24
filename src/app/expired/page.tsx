'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Clock } from 'lucide-react'

export default function ExpiredPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-inf-paper">
      {/* Ambient gold bloom behind the card */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[33%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-inf-gold/10 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md text-center animate-fade-up">
        <img src="/influunt-lockup-light.png" alt="Influunt" width={180} className="mx-auto mb-6" />
        <div className="bg-white border border-inf-line rounded-inf-panel shadow-[0_24px_48px_-12px_rgba(23,65,51,0.14)] p-8">
          <div className="py-4">
            <div className="w-14 h-14 bg-inf-gold/10 rounded-inf-card flex items-center justify-center mx-auto mb-4">
              <Clock size={28} className="text-inf-gold" />
            </div>
            <h1 className="text-xl font-semibold text-inf-green mb-2">Access Expired</h1>
            <p className="text-sm text-inf-muted mb-6">
              Your access to the Influunt data room has expired. Contact{' '}
              <span className="text-inf-gold">brad@influunt.global</span> to request an extension.
            </p>
            <Button onClick={handleSignOut} variant="secondary" className="w-full">
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
