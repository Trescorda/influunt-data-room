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
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-inf-obsidian inf-on-dark">
      {/* Ambient gold bloom behind the card */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[33%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-inf-gold/10 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md text-center animate-fade-up">
        <img src="/influunt-lockup-dark.png" alt="Influunt" width={180} className="mx-auto mb-6" />
        <div className="bg-inf-dark-card/80 backdrop-blur-sm border border-inf-gold/20 rounded-inf-panel shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] p-8">
          <div className="py-4">
            <div className="w-14 h-14 bg-inf-gold/10 rounded-inf-card flex items-center justify-center mx-auto mb-4">
              <Clock size={28} className="text-inf-gold" />
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">Access Expired</h1>
            <p className="text-sm text-white/60 mb-6">
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
