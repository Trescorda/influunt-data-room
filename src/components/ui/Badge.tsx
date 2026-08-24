type BadgeVariant = 'gold' | 'green' | 'red' | 'gray' | 'blue'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

/** Portal badges — tinted fills, no hard borders. */
const variants: Record<BadgeVariant, string> = {
  gold: 'bg-inf-gold/[0.14] text-inf-gold-deep',
  green: 'bg-inf-green-600/[0.12] text-inf-green-600',
  red: 'bg-red-600/[0.10] text-red-700',
  gray: 'bg-inf-green/[0.07] text-inf-green/60',
  blue: 'bg-blue-600/[0.10] text-blue-700',
}

export function Badge({ variant = 'gray', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.04em] ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
