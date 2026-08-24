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
      <h2 className="text-lg font-bold text-inf-green mb-1">Your investment journey</h2>
      <p className="text-sm text-inf-muted mb-4">
        Follow these steps to understand the Influunt opportunity
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {steps.map((step, i) => {
          const Icon = step.icon
          const doc = documents[i]
          const isQA = i === 4
          const href = isQA ? '/room/qa' : doc ? `/room/documents/${doc.id}` : null
          const hasLink = !!href

          const content = (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full bg-inf-gold/15 text-inf-gold-deep text-lg font-bold flex items-center justify-center" data-numeric>
                  {step.number}
                </span>
                <Icon size={18} className="text-inf-gold" />
              </div>
              <h3 className="text-base font-semibold text-inf-green group-hover:text-inf-gold-deep transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-inf-muted mt-1">
                {doc ? doc.title : step.subtitle}
              </p>
              {hasLink ? (
                step.time && <p className="text-xs text-inf-gold-deep/70 mt-3">{step.time}</p>
              ) : (
                <p className="text-xs text-inf-muted mt-3 italic">Available soon</p>
              )}
            </>
          )

          if (hasLink) {
            return (
              <Link
                key={step.number}
                href={href}
                className="group bg-white border border-inf-line rounded-inf-card p-4 min-h-[140px] hover:border-inf-gold/40 hover:bg-inf-green/[0.03] transition-all"
              >
                {content}
              </Link>
            )
          }

          return (
            <div
              key={step.number}
              className="bg-white border border-inf-line rounded-inf-card p-4 min-h-[140px] opacity-50"
            >
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
