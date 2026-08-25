'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { Card } from '@/components/ui/Card'
import { Loading } from '@/components/ui/Loading'
import { Calendar } from 'lucide-react'

export default function BookACallPage() {
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        setCalendlyUrl(d.settings?.calendly_url || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="px-4 md:px-8 py-4 md:py-6 space-y-4 overflow-y-auto h-full">
      <div>
        <h1 className="text-xl font-semibold text-inf-green">Book a Call</h1>
        <p className="text-sm text-inf-muted mt-1">
          Schedule a conversation with the Influunt team to discuss the investment opportunity, ask questions, and explore how Influunt fits your portfolio.
        </p>
      </div>

      {calendlyUrl ? (
        <>
          <div
            className="calendly-inline-widget rounded-inf-card overflow-hidden border border-inf-line"
            data-url={`${calendlyUrl}?background_color=F8F7F4&text_color=2B2B2B&primary_color=C8964F`}
            style={{ minWidth: '320px', height: '700px' }}
          />
          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="lazyOnload"
          />
        </>
      ) : (
        <Card padding="lg">
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-inf-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} className="text-inf-gold" />
            </div>
            <h2 className="text-lg font-semibold text-inf-green mb-2">Schedule a call</h2>
            <p className="text-sm text-inf-muted mb-1">
              To schedule a call, email <span className="text-inf-gold-deep font-medium">brad@influunt.global</span>
            </p>
            <p className="text-xs text-inf-muted">
              We respond within 24 hours and can arrange a time that suits you.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
