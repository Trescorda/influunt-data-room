'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  /** Render for a dark (obsidian) ground — auth screens and dark sections. */
  onDark?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, onDark = false, className = '', ...props }, ref) => {
    const field = onDark
      ? 'w-full rounded-inf bg-inf-dark-input border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-inf-gold/70 focus:ring-1 focus:ring-inf-gold/40 transition-all duration-200'
      : 'w-full rounded-inf bg-white border border-inf-line-strong px-4 py-2.5 text-sm text-inf-body placeholder:text-inf-subtle outline-none hover:border-inf-gold/40 focus:border-inf-gold/60 focus:ring-1 focus:ring-inf-gold/30 transition-all duration-200'

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            className={
              onDark
                ? 'block text-[11px] tracking-[0.2em] uppercase text-white/50'
                : 'block text-[11px] tracking-[0.15em] uppercase font-semibold text-inf-green/60'
            }
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${field} ${error ? (onDark ? 'border-red-400/60' : 'border-red-500/60') : ''} ${className}`}
          {...props}
        />
        {error && <p className={`text-sm ${onDark ? 'text-red-400' : 'text-red-600'}`}>{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
