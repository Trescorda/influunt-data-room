'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-inf-green/60">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-inf bg-white border border-inf-line-strong px-4 py-2.5 text-sm text-inf-body placeholder:text-inf-subtle outline-none hover:border-inf-gold/40 focus:border-inf-gold/60 focus:ring-1 focus:ring-inf-gold/30 transition-all duration-200 ${
            error ? 'border-red-500/60' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
