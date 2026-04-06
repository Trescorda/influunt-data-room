type BadgeVariant = 'gold' | 'green' | 'red' | 'gray' | 'blue'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  gold: 'bg-brand-gold/20 text-brand-gold border-brand-gold/30',
  green: 'bg-green-500/20 text-green-400 border-green-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  gray: 'bg-brand-border/50 text-brand-muted border-brand-border',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

export function Badge({ variant = 'gray', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
