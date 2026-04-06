'use client'

import Link from 'next/link'
import { FileText, Presentation, BarChart3, MessageSquare, Sparkles } from 'lucide-react'
import type { Document } from '@/lib/types'

const steps = [
  {
    number: 1,
    title: 'The opportunity',
    subtitle: 'One-page summary',
    time: '3 min read',
    icon: Sparkles,
  },
  {
    number: 2,
    title: 'The full picture',
    subtitle: 'Executive summary',
    time: '10 min read',
    icon: FileText,
  },
  {
    number: 3,
    title: 'See the vision',
    subtitle: 'Investor presentation',
    time: '15 min read',
    icon: Presentation,
  },
  {
    number: 4,
    title: 'The numbers',
    subtitle: 'Financial highlights',
    time: '8 min read',
    icon: BarChart3,
  },
  {
    number: 5,
    title: 'Ready to talk?',
    subtitle: 'Ask us anything',
    time: '',
    icon: MessageSquare,
  },
]

interface GuidedJourneyProps {
  documents: (Document | null)[]
}

export function GuidedJourney({ documents }: GuidedJourneyProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-brand-text mb-0.5">Your investment journey</h2>
      <p className="text-xs text-brand-muted mb-3">
        Follow these steps to understand the Influunt opportunity
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {steps.map((step, i) => {
          const Icon = step.icon
          const doc = documents[i]
          const isQA = i === 4
          const href = isQA ? '/room/qa' : doc ? `/room/documents/${doc.id}` : null
          const hasLink = !!href

          const content = (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold flex items-center justify-center">
                  {step.number}
                </span>
                <Icon size={16} className="text-brand-gold" />
              </div>
              <h3 className="text-sm font-semibold text-brand-text group-hover:text-brand-gold transition-colors">
                {step.title}
              </h3>
              <p className="text-xs text-brand-muted mt-1">
                {doc ? doc.title : step.subtitle}
              </p>
              {hasLink ? (
                step.time && <p className="text-xs text-brand-gold/70 mt-2">{step.time}</p>
              ) : (
                <p className="text-xs text-brand-muted/50 mt-2 italic">Coming soon</p>
              )}
            </>
          )

          if (hasLink) {
            return (
              <Link
                key={step.number}
                href={href}
                className="group bg-brand-card border border-brand-border rounded-xl p-3 hover:border-brand-gold/40 transition-all"
              >
                {content}
              </Link>
            )
          }

          return (
            <div
              key={step.number}
              className="bg-brand-card border border-brand-border rounded-xl p-3 opacity-60"
            >
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
