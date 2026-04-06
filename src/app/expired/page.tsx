'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Clock } from 'lucide-react'

export default function ExpiredPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <img src="/influunt-logo.png" alt="Influunt" width={180} className="mx-auto mb-6" />
        <Card padding="lg">
          <div className="py-4">
            <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock size={28} className="text-brand-gold" />
            </div>
            <h1 className="text-xl font-semibold text-brand-text mb-2">Access Expired</h1>
            <p className="text-sm text-brand-muted mb-6">
              Your access to the Influunt data room has expired. Contact{' '}
              <span className="text-brand-gold">brad@influunt.global</span> to request an extension.
            </p>
            <Button onClick={handleSignOut} variant="secondary" className="w-full">
              Sign out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
