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
    timing: 'Q3 2026',
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

// Stage 3 — Server rack filled with gold bars (data centre + gold storage)
function RackIcon({ active }: { active: boolean }) {
  const stroke = '#C8A85C'
  const op = active ? 1 : 0.5
  const barFill = active ? 'rgba(200,168,92,0.35)' : 'rgba(200,168,92,0.15)'

  // Single gold bar inside a rack shelf
  const shelfBar = (y: number, key: string) => (
    <g key={key}>
      {/* Shelf divider */}
      <line x1="18" y1={y - 4} x2="50" y2={y - 4} stroke={stroke} strokeWidth="0.8" opacity={op * 0.5} />
      {/* Gold bar inside the shelf — a trapezoid lying flat */}
      <path
        d={`M 22 ${y + 3} L 46 ${y + 3} L 44 ${y - 2} L 24 ${y - 2} Z`}
        stroke={stroke}
        strokeWidth="1.1"
        strokeLinejoin="round"
        opacity={op}
        fill={barFill}
      />
      <line x1="24" y1={y - 2} x2="44" y2={y - 2} stroke={stroke} strokeWidth="0.6" opacity={op * 0.6} />
    </g>
  )

  return (
    <svg width="68" height="56" viewBox="0 0 68 56" fill="none" className="mx-auto">
      {/* Server-rack frame */}
      <rect x="14" y="4" width="40" height="48" rx="2" stroke={stroke} strokeWidth="1.6" opacity={op} fill={active ? 'rgba(200,168,92,0.05)' : 'transparent'} />
      {/* Top-of-rack indicator strip */}
      <rect x="16" y="6" width="36" height="3" rx="1" stroke={stroke} strokeWidth="0.8" opacity={op * 0.7} fill="transparent" />
      <circle cx="48" cy="7.5" r="0.8" fill={stroke} opacity={op} />
      <circle cx="50" cy="7.5" r="0.8" fill={stroke} opacity={op * 0.6} />
      {/* Four shelves with gold bars */}
      {shelfBar(16, 's1')}
      {shelfBar(26, 's2')}
      {shelfBar(36, 's3')}
      {shelfBar(46, 's4')}
      {/* Bottom feet */}
      <line x1="18" y1="52" x2="18" y2="55" stroke={stroke} strokeWidth="1" opacity={op * 0.7} />
      <line x1="50" y1="52" x2="50" y2="55" stroke={stroke} strokeWidth="1" opacity={op * 0.7} />
    </svg>
  )
}

function StageInfographic({ icon, active }: { icon: Stage['icon']; active: boolean }) {
  if (icon === 'foundation') return <FoundationIcon active={active} />
  if (icon === 'bars') return <BarsIcon active={active} />
  return <RackIcon active={active} />
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
      <div className="relative -mt-1 mb-3">
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
