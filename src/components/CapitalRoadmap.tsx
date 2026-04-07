'use client'

import { Badge } from '@/components/ui/Badge'

interface Stage {
  number: number
  label: string
  amount: string
  description: string
  timing: string
  status: 'active' | 'upcoming' | 'planned'
  milestones: string[]
}

const stages: Stage[] = [
  {
    number: 1,
    label: 'Seed Round',
    amount: 'A$5M',
    description: 'Platform build, licensing, team, go-to-market',
    timing: 'Now — Q2 2026',
    status: 'active',
    milestones: ['Platform MVP launch', 'AFSL enhancement', 'Team hiring'],
  },
  {
    number: 2,
    label: 'Round A',
    amount: 'A$35M',
    description: 'Strategic acquisitions, infrastructure scaling, market expansion',
    timing: 'Q2 2026',
    status: 'upcoming',
    milestones: ['Malta MiCA CASP', 'Institutional partnerships', 'Revenue growth'],
  },
  {
    number: 3,
    label: 'Round B',
    amount: 'A$250M',
    description: 'BioGold urban mining, sovereign asset infrastructure',
    timing: 'FY2028',
    status: 'planned',
    milestones: ['BioGold deployment', 'Global expansion', 'Sovereign infrastructure'],
  },
]

function TreeRoot() {
  return (
    <svg width="56" height="80" viewBox="0 0 56 80" fill="none" className="flex-shrink-0">
      {/* Roots */}
      <path d="M8 70 Q 14 60 20 55" stroke="#C8A85C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M48 70 Q 42 60 36 55" stroke="#C8A85C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M28 74 L 28 60" stroke="#C8A85C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Trunk */}
      <path d="M28 60 L 28 30" stroke="#C8A85C" strokeWidth="2.5" strokeLinecap="round" />
      {/* Branches */}
      <path d="M28 42 Q 20 36 12 30" stroke="#C8A85C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 36 Q 38 30 46 22" stroke="#C8A85C" strokeWidth="1.5" strokeLinecap="round" />
      {/* Leaves */}
      <circle cx="12" cy="30" r="2.5" fill="#C8A85C" opacity="0.8" />
      <circle cx="46" cy="22" r="2.5" fill="#C8A85C" opacity="0.8" />
      <circle cx="28" cy="28" r="3" fill="#C8A85C" />
      {/* Small leaves near top */}
      <ellipse cx="20" cy="32" rx="2" ry="3" fill="#C8A85C" opacity="0.5" transform="rotate(-20 20 32)" />
      <ellipse cx="36" cy="30" rx="2" ry="3" fill="#C8A85C" opacity="0.5" transform="rotate(20 36 30)" />
    </svg>
  )
}

function BranchUp({ active }: { active: boolean }) {
  // Small decorative branch rising from the trunk to the stage node
  return (
    <svg width="60" height="50" viewBox="0 0 60 50" fill="none" className="mx-auto">
      {/* Vertical branch with gentle curve */}
      <path
        d="M30 50 Q 28 30 30 10"
        stroke="#C8A85C"
        strokeWidth={active ? '2.5' : '2'}
        strokeLinecap="round"
        opacity={active ? 1 : 0.5}
      />
      {/* Decorative leaves */}
      <ellipse cx="22" cy="28" rx="3" ry="5" fill="#C8A85C" opacity={active ? 0.7 : 0.3} transform="rotate(-30 22 28)" />
      <ellipse cx="38" cy="22" rx="3" ry="5" fill="#C8A85C" opacity={active ? 0.7 : 0.3} transform="rotate(30 38 22)" />
    </svg>
  )
}

function TrunkSegment({ activeSide }: { activeSide: 'left' | 'right' | 'none' }) {
  // Horizontal trunk segment between stages, with decorative leaves
  return (
    <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none" fill="none" className="flex-1">
      {/* Main trunk line */}
      <line x1="0" y1="20" x2="200" y2="20" stroke="#C8A85C" strokeWidth="2" opacity="0.7" />
      {/* Decorative leaves along the trunk */}
      <ellipse cx="50" cy="12" rx="2.5" ry="4" fill="#C8A85C" opacity="0.4" transform="rotate(-15 50 12)" />
      <ellipse cx="100" cy="28" rx="2.5" ry="4" fill="#C8A85C" opacity="0.4" transform="rotate(15 100 28)" />
      <ellipse cx="150" cy="12" rx="2.5" ry="4" fill="#C8A85C" opacity="0.4" transform="rotate(-15 150 12)" />
      {/* Small nodes */}
      <circle cx="75" cy="20" r="2" fill="#C8A85C" opacity="0.5" />
      <circle cx="125" cy="20" r="2" fill="#C8A85C" opacity="0.5" />
    </svg>
  )
}

function StageNode({ stage }: { stage: Stage }) {
  const isActive = stage.status === 'active'
  const isUpcoming = stage.status === 'upcoming'

  return (
    <div className="flex flex-col items-center text-center px-4">
      {/* Branch rising up */}
      <BranchUp active={isActive} />

      {/* Node / circle */}
      <div className="relative -mt-2 mb-3">
        {isActive && (
          <div className="absolute inset-0 rounded-full bg-brand-gold/30 blur-md animate-pulse" />
        )}
        <div
          className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 ${
            isActive
              ? 'bg-brand-gold border-brand-gold shadow-lg shadow-brand-gold/40'
              : isUpcoming
                ? 'bg-brand-dark border-brand-gold'
                : 'bg-brand-dark border-brand-border'
          }`}
        >
          <span className={`text-sm font-bold ${isActive ? 'text-brand-darker' : isUpcoming ? 'text-brand-gold' : 'text-brand-muted'}`}>
            {stage.number}
          </span>
        </div>
      </div>

      {/* Stage label */}
      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isActive ? 'text-brand-gold' : 'text-brand-muted'}`}>
        {stage.label}
      </p>

      {/* Amount */}
      <p className={`text-3xl font-bold mb-2 ${isActive ? 'text-brand-gold' : 'text-brand-text'}`}>
        {stage.amount}
      </p>

      {/* Description */}
      <p className="text-xs text-brand-muted max-w-[220px] leading-relaxed mb-2">
        {stage.description}
      </p>

      {/* Timing */}
      <p className="text-xs text-brand-muted/70 mb-3">{stage.timing}</p>

      {/* Badge */}
      <div className="mb-4">
        {isActive ? (
          <Badge variant="gold">Active</Badge>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border border-brand-border text-brand-muted">
            {isUpcoming ? 'Upcoming' : 'Planned'}
          </span>
        )}
      </div>

      {/* Milestones */}
      <ul className="space-y-1.5 text-left">
        {stage.milestones.map((m, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-brand-gold' : 'bg-brand-gold/40'}`} />
            <span className="text-brand-muted">{m}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CapitalRoadmap() {
  return (
    <section className="bg-[#222] border border-brand-border rounded-2xl p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-brand-text">Capital raise roadmap</h2>
        <p className="text-sm text-brand-muted mt-1">
          A$290M across three stages — from seed to sovereign infrastructure
        </p>
      </div>

      {/* Desktop: horizontal tree */}
      <div className="hidden md:block">
        <div className="flex items-start">
          {/* Left: tree root graphic */}
          <div className="flex-shrink-0 pt-20">
            <TreeRoot />
          </div>

          {/* Three stages with connecting trunk segments */}
          <div className="flex-1 flex items-start">
            <StageNode stage={stages[0]} />
            <div className="flex-1 pt-[88px]">
              <TrunkSegment activeSide="left" />
            </div>
            <StageNode stage={stages[1]} />
            <div className="flex-1 pt-[88px]">
              <TrunkSegment activeSide="none" />
            </div>
            <StageNode stage={stages[2]} />
          </div>
        </div>
      </div>

      {/* Mobile: stacked vertical */}
      <div className="md:hidden space-y-6">
        {stages.map((stage) => (
          <div key={stage.number} className="border-l-2 border-brand-gold/40 pl-5 py-2">
            <StageNode stage={stage} />
          </div>
        ))}
      </div>

      {/* Total raise footer */}
      <div className="mt-8 pt-6 border-t border-brand-border text-center">
        <p className="text-sm text-brand-muted">
          Total raise: <span className="text-brand-gold font-bold text-base">A$290M</span> across three stages
        </p>
      </div>
    </section>
  )
}
