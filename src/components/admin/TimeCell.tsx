'use client'

import { useEffect, useState } from 'react'

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

interface TimeCellProps {
  timestamp: string
  className?: string
}

export function TimeCell({ timestamp, className }: TimeCellProps) {
  // Format only after hydration so server and client agree on initial markup
  const [formatted, setFormatted] = useState<string>('')

  useEffect(() => {
    setFormatted(formatDateTime(timestamp))
  }, [timestamp])

  return (
    <span className={className} title={formatted}>
      {formatted}
    </span>
  )
}
