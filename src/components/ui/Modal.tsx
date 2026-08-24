'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-inf-green/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className="bg-white border border-inf-line rounded-inf-panel w-full max-w-lg mx-4 shadow-[0_32px_64px_rgba(23,65,51,0.22)] animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-inf-line">
          <h2 className="text-lg font-semibold text-inf-green">{title}</h2>
          <button
            onClick={onClose}
            className="text-inf-muted hover:text-inf-green p-1.5 -mr-1.5 rounded-inf hover:bg-inf-green/[0.06] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}
