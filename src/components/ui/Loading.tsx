export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 animate-fade-in">
      <svg className="animate-spin h-5 w-5 text-brand-gold" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V1.5C6.201 1.5 1.5 6.201 1.5 12H4z" />
      </svg>
      <p className="text-xs text-brand-muted uppercase tracking-[0.14em]">{label}</p>
    </div>
  )
}
