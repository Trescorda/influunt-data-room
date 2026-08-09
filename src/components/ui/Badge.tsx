type BadgeVariant = 'gold' | 'green' | 'red' | 'gray' | 'blue'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  gold: 'bg-brand-gold/15 text-brand-gold-bright border-brand-gold/30',
  green: 'bg-green-500/15 text-green-400 border-green-500/25',
  red: 'bg-red-500/15 text-red-400 border-red-500/25',
  gray: 'bg-white/[0.06] text-brand-muted border-brand-border',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
}

export function Badge({ variant = 'gray', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium tracking-wide rounded-full border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
