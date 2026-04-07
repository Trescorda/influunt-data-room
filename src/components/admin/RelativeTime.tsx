'use client'

import { useEffect, useState } from 'react'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

function formatFullDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function RelativeTime({ timestamp }: { timestamp: string }) {
  // Render nothing on first paint to avoid server/client hydration mismatch
  const [label, setLabel] = useState<string>('')
  const [title, setTitle] = useState<string>('')

  useEffect(() => {
    setLabel(timeAgo(timestamp))
    setTitle(formatFullDateTime(timestamp))
  }, [timestamp])

  return <span title={title} className="cursor-help">{label}</span>
}
