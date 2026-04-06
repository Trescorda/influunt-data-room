'use client'

import Link from 'next/link'
import { FileText, Presentation, BarChart3, MessageSquare, Sparkles } from 'lucide-react'

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
    href: '/room/qa',
  },
]

export function GuidedJourney() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-brand-text mb-1">Your investment journey</h2>
      <p className="text-sm text-brand-muted mb-5">
        Follow these steps to understand the Influunt opportunity
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {steps.map((step) => {
          const Icon = step.icon
          const Wrapper = step.href ? Link : 'div'
          return (
            <Wrapper
              key={step.number}
              href={step.href || '#'}
              className="group bg-brand-card border border-brand-border rounded-xl p-4 hover:border-brand-gold/40 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold flex items-center justify-center">
                  {step.number}
                </span>
                <Icon size={16} className="text-brand-gold" />
              </div>
              <h3 className="text-sm font-semibold text-brand-text group-hover:text-brand-gold transition-colors">
                {step.title}
              </h3>
              <p className="text-xs text-brand-muted mt-1">{step.subtitle}</p>
              {step.time && (
                <p className="text-xs text-brand-gold/70 mt-2">{step.time}</p>
              )}
            </Wrapper>
          )
        })}
      </div>
    </div>
  )
}
