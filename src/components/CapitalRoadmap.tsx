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
  icon: 'foundation' | 'bars' | 'rack'
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
    icon: 'foundation',
  },
  {
    number: 2,
    label: 'Round A',
    amount: 'A$35M',
    description: 'Urban mining licences, gold extraction pilots, regulatory approvals',
    timing: 'Q1 2027',
    status: 'upcoming',
    milestones: ['Urban mining licences', 'Gold extraction pilots', 'Regulatory approvals'],
    icon: 'bars',
  },
  {
    number: 3,
    label: 'Round B',
    amount: 'A$250M',
    description: 'Scale urban mining, sovereign asset infrastructure, global expansion',
    timing: 'FY2028',
    status: 'planned',
    milestones: ['BioGold deployment at scale', 'Global expansion', 'Sovereign infrastructure'],
    icon: 'rack',
  },
]

// Stage 1 — Foundation: pillars (structure / tech / team)
function FoundationIcon({ active }: { active: boolean }) {
  const stroke = '#C8A85C'
  const op = active ? 1 : 0.5
  return (
    <svg width="68" height="56" viewBox="0 0 68 56" fill="none" className="mx-auto">
      {/* Base / ground line */}
      <line x1="6" y1="48" x2="62" y2="48" stroke={stroke} strokeWidth="1.5" opacity={op * 0.7} />
      {/* Three pillars of slightly different heights */}
      <rect x="12" y="22" width="10" height="26" stroke={stroke} strokeWidth="1.6" opacity={op} fill={active ? 'rgba(200,168,92,0.12)' : 'transparent'} rx="1" />
      <rect x="29" y="14" width="10" height="34" stroke={stroke} strokeWidth="1.6" opacity={op} fill={active ? 'rgba(200,168,92,0.18)' : 'transparent'} rx="1" />
      <rect x="46" y="20" width="10" height="28" stroke={stroke} strokeWidth="1.6" opacity={op} fill={active ? 'rgba(200,168,92,0.12)' : 'transparent'} rx="1" />
      {/* Small markers on each pillar to suggest structure / tech / team */}
      <circle cx="17" cy="30" r="1.6" fill={stroke} opacity={op} />
      <circle cx="34" cy="22" r="1.6" fill={stroke} opacity={op} />
      <circle cx="51" cy="28" r="1.6" fill={stroke} opacity={op} />
      {/* Connecting cap (suggests platform / shared foundation) */}
      <path d="M10 14 L 58 14" stroke={stroke} strokeWidth="1.2" opacity={op * 0.6} strokeDasharray="2 3" />
    </svg>
  )
}

// Stage 2 — Pyramid stack of gold bars
function BarsIcon({ active }: { active: boolean }) {
  const stroke = '#C8A85C'
  const op = active ? 1 : 0.5
  const fillStrong = active ? 'rgba(200,168,92,0.35)' : 'rgba(200,168,92,0.15)'
  const fillSoft = active ? 'rgba(200,168,92,0.25)' : 'rgba(200,168,92,0.1)'

  // Each bar is a small trapezoid (wider at bottom, narrower at top — classic gold bar profile)
  const bar = (cx: number, cy: number, key: string, fill: string) => (
    <g key={key}>
      <path
        d={`M ${cx - 7} ${cy + 4} L ${cx + 7} ${cy + 4} L ${cx + 5} ${cy - 4} L ${cx - 5} ${cy - 4} Z`}
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity={op}
        fill={fill}
      />
      {/* Top highlight line for shine */}
      <line x1={cx - 5} y1={cy - 4} x2={cx + 5} y2={cy - 4} stroke={stroke} strokeWidth="0.8" opacity={op * 0.6} />
    </g>
  )

  return (
    <svg width="68" height="56" viewBox="0 0 68 56" fill="none" className="mx-auto">
      {/* Bottom row: 3 bars */}
      {bar(15, 46, 'b1', fillSoft)}
      {bar(34, 46, 'b2', fillSoft)}
      {bar(53, 46, 'b3', fillSoft)}
      {/* Middle row: 2 bars (nestled in the valleys) */}
      {bar(24, 35, 'm1', fillStrong)}
      {bar(44, 35, 'm2', fillStrong)}
      {/* Top row: 1 bar */}
      {bar(34, 24, 't1', fillStrong)}
    </svg>
  )
}

// Stage 3 — Expansion: growing stacks of gold bars + upward growth arrow
function ExpansionIcon({ active }: { active: boolean }) {
  const stroke = '#C8A85C'
  const op = active ? 1 : 0.5
  const fillSoft = active ? 'rgba(200,168,92,0.2)' : 'rgba(200,168,92,0.1)'
  const fillStrong = active ? 'rgba(200,168,92,0.35)' : 'rgba(200,168,92,0.15)'

  // Reusable gold-bar trapezoid centred at (cx, cy)
  const bar = (cx: number, cy: number, key: string, fill: string) => (
    <g key={key}>
      <path
        d={`M ${cx - 6} ${cy + 2.5} L ${cx + 6} ${cy + 2.5} L ${cx + 4.5} ${cy - 2.5} L ${cx - 4.5} ${cy - 2.5} Z`}
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity={op}
        fill={fill}
      />
      <line x1={cx - 4.5} y1={cy - 2.5} x2={cx + 4.5} y2={cy - 2.5} stroke={stroke} strokeWidth="0.6" opacity={op * 0.6} />
    </g>
  )

  return (
    <svg width="68" height="56" viewBox="0 0 68 56" fill="none" className="mx-auto">
      {/* Subtle ground line */}
      <line x1="4" y1="50" x2="56" y2="50" stroke={stroke} strokeWidth="1" opacity={op * 0.4} />

      {/* Stack 1 — small (1 bar) */}
      {bar(11, 47, 's1-a', fillSoft)}

      {/* Stack 2 — medium (2 bars) */}
      {bar(28, 47, 's2-a', fillSoft)}
      {bar(28, 41, 's2-b', fillStrong)}

      {/* Stack 3 — large (3 bars) */}
      {bar(45, 47, 's3-a', fillSoft)}
      {bar(45, 41, 's3-b', fillStrong)}
      {bar(45, 35, 's3-c', fillStrong)}

      {/* Upward growth arrow tracking the top of each stack */}
      <path
        d="M 11 38 L 28 32 L 45 26 L 60 14"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={op * 0.85}
        fill="none"
        strokeDasharray="3 2"
      />
      {/* Arrow head */}
      <path
        d="M 60 14 L 55 14 M 60 14 L 60 19"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={op}
      />
    </svg>
  )
}

function StageInfographic({ icon, active }: { icon: Stage['icon']; active: boolean }) {
  if (icon === 'foundation') return <FoundationIcon active={active} />
  if (icon === 'bars') return <BarsIcon active={active} />
  return <ExpansionIcon active={active} />
}

function ConnectorSegment() {
  // Clean horizontal connector between stages with subtle progress dots
  return (
    <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none" fill="none" className="flex-1">
      <line x1="0" y1="20" x2="200" y2="20" stroke="#C8A85C" strokeWidth="1.5" opacity="0.4" strokeDasharray="3 4" />
      <circle cx="60" cy="20" r="2" fill="#C8A85C" opacity="0.5" />
      <circle cx="100" cy="20" r="2.5" fill="#C8A85C" opacity="0.6" />
      <circle cx="140" cy="20" r="2" fill="#C8A85C" opacity="0.5" />
    </svg>
  )
}

function StageNode({ stage }: { stage: Stage }) {
  const isActive = stage.status === 'active'
  const isUpcoming = stage.status === 'upcoming'

  return (
    <div className="flex flex-col items-center text-center px-4">
      {/* Stage-specific infographic */}
      <StageInfographic icon={stage.icon} active={isActive} />

      {/* Node / circle */}
      <div className="relative mt-4 mb-3">
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

      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isActive ? 'text-brand-gold' : 'text-brand-muted'}`}>
        {stage.label}
      </p>

      <p className={`text-3xl font-bold mb-2 ${isActive ? 'text-brand-gold' : 'text-brand-text'}`}>
        {stage.amount}
      </p>

      <p className="text-xs text-brand-muted max-w-[220px] leading-relaxed mb-2">
        {stage.description}
      </p>

      <p className="text-xs text-brand-muted/70 mb-3">{stage.timing}</p>

      <div className="mb-4">
        {isActive ? (
          <Badge variant="gold">Active</Badge>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border border-brand-border text-brand-muted">
            {isUpcoming ? 'Upcoming' : 'Planned'}
          </span>
        )}
      </div>

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

      {/* Desktop: horizontal infographic timeline */}
      <div className="hidden md:block">
        <div className="flex items-start">
          <StageNode stage={stages[0]} />
          <div className="flex-1 pt-[88px]">
            <ConnectorSegment />
          </div>
          <StageNode stage={stages[1]} />
          <div className="flex-1 pt-[88px]">
            <ConnectorSegment />
          </div>
          <StageNode stage={stages[2]} />
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

      <div className="mt-8 pt-6 border-t border-brand-border text-center">
        <p className="text-sm text-brand-muted">
          Total raise: <span className="text-brand-gold font-bold text-base">A$290M</span> across three stages
        </p>
      </div>
    </section>
  )
}
