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
          <label className="block text-sm font-medium text-brand-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 bg-brand-darker/60 border border-brand-border rounded-lg text-brand-text placeholder:text-brand-muted/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] hover:border-brand-border-strong focus:outline-none focus:ring-[3px] focus:ring-brand-gold/15 focus:border-brand-gold/60 transition-[border-color,box-shadow] duration-200 ${error ? 'border-red-500/60' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
