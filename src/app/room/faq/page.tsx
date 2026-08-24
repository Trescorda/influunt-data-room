'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Search, ChevronDown, MessageSquare } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
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

  if (loading) return <Loading />

  return (
    <div className="px-4 md:px-8 py-4 md:py-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-xl font-semibold text-inf-green">Frequently Asked Questions</h1>
        <p className="text-sm text-inf-muted mt-1">Find answers to common questions about investing in Influunt</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-inf-muted pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-inf-line-strong rounded-inf text-sm text-inf-body placeholder:text-inf-subtle shadow-[inset_0_1px_2px_rgba(23,65,51,0.04)] hover:border-inf-green/25 focus:outline-none focus:ring-1 focus:ring-inf-gold/30 focus:border-inf-gold/60 transition-[border-color,box-shadow] duration-200"
        />
      </div>

      {faqs.length === 0 ? (
        <Card padding="lg">
          <p className="text-center text-inf-muted text-sm py-8">No FAQs available yet.</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card padding="lg">
          <p className="text-center text-inf-muted text-sm py-4">No results for &ldquo;{search}&rdquo;</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <div className="mb-3">
                <h2 className="inf-eyebrow text-xs">{cat}</h2>
                <div className="h-px bg-inf-line mt-1.5" />
              </div>
              <div className="space-y-1">
                {filtered.filter((f) => f.category === cat).map((faq) => {
                  const isOpen = openId === faq.id
                  return (
                    <div key={faq.id} className={`border rounded-inf-card overflow-hidden transition-all duration-200 ${isOpen ? 'border-inf-gold/40 bg-inf-gold/[0.03] shadow-[0_4px_16px_rgba(23,65,51,0.08)]' : 'border-inf-line bg-white hover:border-inf-line-strong'}`}>
                      <button
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-inf-green/[0.03] transition-colors"
                      >
                        <span className={`text-sm font-medium pr-4 transition-colors ${isOpen ? 'text-inf-gold-deep' : 'text-inf-green'}`}>{faq.question}</span>
                        <ChevronDown size={16} className={`text-inf-muted flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 animate-fade-in">
                          <div className="border-l-2 border-inf-gold/50 pl-4">
                            <p className="text-sm text-inf-muted leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                          </div>
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
            <p className="text-sm text-inf-green font-medium">Have a question that isn&apos;t answered here?</p>
            <p className="text-xs text-inf-muted mt-0.5">Submit your question and our team will respond</p>
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
