'use client'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

interface ActivityRowProps {
  initial: string
  name: string
  actionLabel: string
  documentTitle?: string
  createdAt: string
}

export function ActivityRow({ initial, name, actionLabel, documentTitle, createdAt }: ActivityRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-brand-border last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-6 h-6 bg-brand-card rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-brand-gold">{initial}</span>
        </div>
        <p className="text-xs text-brand-text truncate">
          <span className="font-medium">{name}</span>{' '}
          <span className="text-brand-muted">{actionLabel}</span>
          {documentTitle && (
            <span className="text-brand-muted"> &ldquo;{documentTitle}&rdquo;</span>
          )}
        </p>
      </div>
      <span
        className="text-[10px] text-brand-muted flex-shrink-0 ml-3 cursor-help"
        title={formatDateTime(createdAt)}
      >
        {timeAgo(createdAt)}
      </span>
    </div>
  )
}
