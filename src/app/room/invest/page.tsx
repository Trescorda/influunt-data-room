'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { FileText, Calendar, Mail, Shield, CheckCircle, ArrowRight, FileCheck, Eye } from 'lucide-react'

const stages = [
  { name: 'Stage 1 — Pre-Seed', amount: 'A$1.6M', timing: 'May 2026 – Oct 2026 · 6 months', current: true },
  { name: 'Stage 2 — Seed', amount: 'A$5M', timing: 'Q4 2026 close · deploys through FY27', current: false },
  { name: 'Stage 3 — Round A', amount: 'A$35M', timing: 'Q1 2028 · FY28 deployment', current: false },
  { name: 'Stage 4 — Round B', amount: 'A$250M', timing: 'FY2028+', current: false },
]

export default function InvestPage() {
  const [cakeUrl, setCakeUrl] = useState('https://app.cakeequity.com')

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings?.cake_equity_url) setCakeUrl(d.settings.cake_equity_url)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="px-4 md:px-8 py-4 md:py-6 space-y-6 overflow-y-auto h-full">
      {/* A. Header */}
      <div>
        <h1 className="text-2xl font-semibold text-brand-text">Invest in Influunt</h1>
        <p className="text-lg text-brand-gold mt-1">Pre-Seed — A$1,600,000</p>
        <p className="text-sm text-brand-muted mt-1">Verified cap table and compliant share issuance powered by Cake Equity</p>
      </div>

      {/* B. Investment Overview */}
      <div className="bg-[#242424] border-l-2 border-brand-gold rounded-xl p-5 md:p-6">
        <h2 className="text-sm font-semibold text-brand-text mb-3">Investment Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div><span className="text-brand-muted">Round:</span> <span className="text-brand-text ml-2">Pre-Seed (Stage 1 of 4)</span></div>
          <div><span className="text-brand-muted">Target Raise:</span> <span className="text-brand-text ml-2">A$1,600,000</span></div>
          <div><span className="text-brand-muted">Minimum Investment:</span> <span className="text-brand-text ml-2">A$250,000 (1% at pre-money)</span></div>
          <div><span className="text-brand-muted">Share Class:</span> <span className="text-brand-text ml-2">Ordinary</span></div>
          <div><span className="text-brand-muted">Pre-Money Valuation:</span> <span className="text-brand-gold ml-2">A$25,000,000</span></div>
          <div><span className="text-brand-muted">Total Capital Strategy:</span> <span className="text-brand-text ml-2">A$291,600,000 across four stages</span></div>
        </div>
      </div>

      {/* C. Capital Raise Timeline */}
      <Card padding="md">
        <h2 className="text-sm font-semibold text-brand-text mb-2">Capital Raise Timeline</h2>
        <p className="text-xs text-brand-muted mb-6 max-w-3xl leading-relaxed">
          Four-stage trajectory totalling A$291.6M. Stage 1 (Pre-Seed) is the active raise — A$1.6M bridge at A$25M pre-money (A$250K = 1%). Stage 2 (Seed) closes during the bridge period. Stages 3 (Round A) and 4 (Round B) are ring-fenced for acquisitions and BioGold deployment respectively.
        </p>

        {/* Desktop: horizontal numbered-circle timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-6 h-px bg-brand-border" />
            <div className="relative grid grid-cols-4 gap-4">
              {stages.map((s, i) => (
                <div key={s.name} className="flex flex-col items-center text-center">
                  <div
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      s.current
                        ? 'bg-brand-gold border-brand-gold shadow-lg shadow-brand-gold/40'
                        : 'bg-brand-darker border-brand-border'
                    }`}
                  >
                    {s.current && <div className="absolute inset-0 rounded-full bg-brand-gold/30 blur-md animate-pulse" />}
                    <span className={`relative text-sm font-bold ${s.current ? 'text-brand-darker' : 'text-brand-muted'}`}>
                      {i + 1}
                    </span>
                  </div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mt-3 ${s.current ? 'text-brand-gold' : 'text-brand-muted'}`}>
                    {s.name}
                  </p>
                  <p className={`text-2xl font-bold mt-2 ${s.current ? 'text-brand-gold' : 'text-brand-text'}`}>
                    {s.amount}
                  </p>
                  <p className="text-xs text-brand-muted mt-1 max-w-[200px] leading-relaxed">{s.timing}</p>
                  {s.current && <Badge variant="gold" className="mt-3">Current Round</Badge>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: stacked vertical list */}
        <div className="md:hidden space-y-4">
          {stages.map((s, i) => (
            <div key={s.name} className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                  s.current ? 'bg-brand-gold border-brand-gold' : 'bg-brand-darker border-brand-border'
                }`}
              >
                <span className={`text-sm font-bold ${s.current ? 'text-brand-darker' : 'text-brand-muted'}`}>{i + 1}</span>
              </div>
              <div className="flex-1">
                <p className={`text-xs font-semibold uppercase tracking-wider ${s.current ? 'text-brand-gold' : 'text-brand-muted'}`}>
                  {s.name}
                </p>
                <p className={`text-xl font-bold ${s.current ? 'text-brand-gold' : 'text-brand-text'}`}>{s.amount}</p>
                <p className="text-xs text-brand-muted mt-0.5">{s.timing}</p>
                {s.current && <Badge variant="gold" className="mt-2">Current Round</Badge>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* D. How to Invest — 5 steps */}
      <div>
        <h2 className="text-sm font-semibold text-brand-text mb-3">How to Invest</h2>
        <div className="space-y-3">
          {/* Step 1 */}
          <Card padding="sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-brand-gold">1</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={14} className="text-brand-gold" />
                  <p className="text-sm font-semibold text-brand-text">Review the Data Room</p>
                </div>
                <p className="text-xs text-brand-muted">Complete your review of all materials in the data room — executive summary, business plan, financials, and technical architecture. Take your time. This is your due diligence.</p>
              </div>
            </div>
          </Card>

          {/* Step 2 */}
          <Card padding="sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-brand-gold">2</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-brand-gold" />
                  <p className="text-sm font-semibold text-brand-text">Book a Call</p>
                </div>
                <p className="text-xs text-brand-muted mb-2">Schedule a conversation with the founding team to discuss the opportunity, ask questions, and determine fit.</p>
                <Link href="/room/book-a-call" className="inline-flex items-center gap-1.5 text-xs text-brand-gold border border-brand-gold rounded-lg px-3 py-1.5 hover:bg-brand-gold/10 transition-colors">
                  Book a Call <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </Card>

          {/* Step 3 */}
          <Card padding="sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-brand-gold">3</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Mail size={14} className="text-brand-gold" />
                  <p className="text-sm font-semibold text-brand-text">Express Interest</p>
                </div>
                <p className="text-xs text-brand-muted mb-2">Notify us of your intended investment amount. We&apos;ll send you a Subscription Agreement and onboard you to our equity platform.</p>
                <a href="mailto:brad@influunt.global" className="inline-flex items-center gap-1.5 text-xs text-brand-gold border border-brand-gold rounded-lg px-3 py-1.5 hover:bg-brand-gold/10 transition-colors">
                  Email brad@influunt.global
                </a>
              </div>
            </div>
          </Card>

          {/* Step 4 — KEY STEP: visually prominent */}
          <div className="bg-brand-card border border-brand-border rounded-xl p-5 relative overflow-hidden" style={{ borderLeftWidth: '3px', borderImage: 'linear-gradient(to bottom, #C8A85C, #8B6914) 1' }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-brand-darker">4</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={16} className="text-brand-gold" />
                  <p className="text-base font-semibold text-brand-text">Complete Investment via Cake Equity</p>
                </div>
                <p className="text-sm text-brand-muted mb-3">Once your Subscription Agreement is ready, you&apos;ll be directed to Cake Equity — our verified equity management platform — to review terms, sign digitally, and complete your investment. Cake handles all legal execution, share certificate issuance, and ASIC compliance.</p>
                <a
                  href={cakeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-brand-darker text-sm font-semibold rounded-lg hover:bg-brand-gold/90 transition-colors"
                >
                  Go to Cake Equity <ArrowRight size={14} />
                </a>
                <p className="text-xs text-brand-muted mt-2">You&apos;ll be redirected to app.cakeequity.com to complete the investment process</p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <Card padding="sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-brand-gold">5</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={14} className="text-brand-gold" />
                  <p className="text-sm font-semibold text-brand-text">Confirmation & Investor Portal</p>
                </div>
                <p className="text-xs text-brand-muted">Once your investment is processed, you&apos;ll receive your share certificate and access to the Cake Equity investor portal — where you can view your holdings, track equity value, and receive updates from Influunt at any time.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* E. Primary CTA Banner */}
      <div className="rounded-xl p-6 md:p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(200,168,92,0.08), rgba(200,168,92,0.03))', border: '1px solid rgba(200,168,92,0.3)' }}>
        <p className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-2">Ready to invest?</p>
        <h3 className="text-xl font-semibold text-brand-text mb-2">Complete your investment securely via Cake Equity</h3>
        <p className="text-sm text-brand-muted max-w-xl mx-auto mb-5">Cake Equity manages Influunt&apos;s share registry, subscription agreements, and ASIC compliance. Your investment is processed through a verified, auditable platform trusted by thousands of companies.</p>
        <a
          href={cakeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-brand-gold text-brand-darker font-semibold rounded-lg hover:bg-brand-gold/90 transition-colors text-sm"
        >
          Proceed to Cake Equity <ArrowRight size={14} />
        </a>
        <p className="text-xs text-brand-muted mt-3">or contact <a href="mailto:brad@influunt.global" className="text-brand-gold hover:text-brand-gold/80">brad@influunt.global</a> for assistance</p>
      </div>

      {/* F. Why Cake Equity? Trust Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-brand-text mb-2">Why Cake Equity?</h3>
          <p className="text-sm text-brand-muted leading-relaxed">Influunt uses Cake Equity as our equity management and share registry platform. Cake is an Australian-founded platform trusted by over 20,000 companies to manage cap tables, capital raises, and investor relations with full ASIC compliance.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield size={14} className="text-brand-gold" />
            </div>
            <p className="text-sm text-brand-muted">ASIC-compliant share issuance and registry</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileCheck size={14} className="text-brand-gold" />
            </div>
            <p className="text-sm text-brand-muted">Digital subscription agreements with e-signature</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Eye size={14} className="text-brand-gold" />
            </div>
            <p className="text-sm text-brand-muted">Investor portal with real-time holdings visibility</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-brand-muted italic -mt-3">Cake Equity is an independent third-party platform. Influunt is not affiliated with Cake Equity beyond using their services for equity management.</p>

      {/* G. Contact */}
      <Card padding="md">
        <h2 className="text-sm font-semibold text-brand-text mb-3">For investment enquiries</h2>
        <p className="text-sm text-brand-muted mb-4">brad@influunt.global</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/room/book-a-call" className="inline-flex items-center gap-2 px-4 py-2 border border-brand-gold text-brand-gold text-sm font-semibold rounded-lg hover:bg-brand-gold/10 transition-colors">
            Book a Call <ArrowRight size={14} />
          </Link>
          <Link href="/room/faq" className="inline-flex items-center gap-2 px-4 py-2 border border-brand-gold text-brand-gold text-sm font-semibold rounded-lg hover:bg-brand-gold/10 transition-colors">
            View FAQ <ArrowRight size={14} />
          </Link>
        </div>
      </Card>
    </div>
  )
}
