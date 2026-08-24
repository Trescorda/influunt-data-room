import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

/**
 * Portal-surface card: white on paper, green hairline, real shadow.
 * Gold is reserved for hover — never the resting border.
 */
export function Card({ padding = 'md', hover = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white border border-inf-line rounded-inf-card shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${
        hover
          ? 'transition-[border-color,box-shadow,transform] duration-300 hover:border-inf-gold/50 hover:shadow-[0_16px_32px_rgba(23,65,51,0.10)] hover:-translate-y-0.5'
          : ''
      } ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
