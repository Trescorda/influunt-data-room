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

export function Card({ padding = 'md', hover = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-brand-card border border-brand-border rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_1px_3px_rgba(0,0,0,0.3)] ${
        hover ? 'transition-all duration-200 hover:border-brand-border-strong hover:bg-brand-card-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_24px_rgba(0,0,0,0.35)]' : ''
      } ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
