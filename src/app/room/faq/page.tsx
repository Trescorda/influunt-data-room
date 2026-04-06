'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Search, ChevronDown, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import type { FAQ } from '@/lib/types'

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/faq')
      .then((r) => r.json())
      .then((d) => { setFaqs(d.faqs || []); setLoading(false) })
  }, [])

  const filtered = faqs.filter((f) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
  })

  const categories = [...new Set(filtered.map((f) => f.category))]

  if (loading) return <div className="p-8 text-center text-brand-muted text-sm">Loading...</div>

  return (
    <div className="px-8 py-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-xl font-semibold text-brand-text">Frequently Asked Questions</h1>
        <p className="text-sm text-brand-muted mt-1">Find answers to common questions about investing in Influunt</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full pl-10 pr-4 py-2.5 bg-brand-card border border-brand-border rounded-lg text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
        />
      </div>

      {faqs.length === 0 ? (
        <Card padding="lg">
          <p className="text-center text-brand-muted text-sm py-8">No FAQs available yet.</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card padding="lg">
          <p className="text-center text-brand-muted text-sm py-4">No results for &ldquo;{search}&rdquo;</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <div className="mb-3">
                <h2 className="text-xs font-semibold text-brand-gold uppercase tracking-wider">{cat}</h2>
                <div className="h-px bg-brand-gold/20 mt-1.5" />
              </div>
              <div className="space-y-1">
                {filtered.filter((f) => f.category === cat).map((faq) => {
                  const isOpen = openId === faq.id
                  return (
                    <div key={faq.id} className={`border rounded-lg overflow-hidden transition-colors ${isOpen ? 'border-brand-gold/30' : 'border-brand-border'}`}>
                      <button
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-brand-card/50 transition-colors"
                      >
                        <span className="text-sm font-medium text-brand-text pr-4">{faq.question}</span>
                        <ChevronDown size={16} className={`text-brand-muted flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 border-l-[3px] border-brand-gold ml-0">
                          <p className="text-sm text-[#A0A0A0] pl-2 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <Card padding="md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-text font-medium">Have a question that isn&apos;t answered here?</p>
            <p className="text-xs text-brand-muted mt-0.5">Submit your question and our team will respond</p>
          </div>
          <Link href="/room/qa">
            <Button size="sm">
              <MessageSquare size={14} className="mr-2" />
              Ask a Question
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
