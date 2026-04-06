'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import type { CapTableEntry } from '@/lib/types'

const typeColors: Record<string, string> = {
  founder: '#C8A85C',
  esop: '#4A90D9',
  seed: '#2ECC71',
  future: '#666666',
}

const typeLabels: Record<string, string> = {
  founder: 'Founders',
  esop: 'ESOP',
  seed: 'Seed',
  future: 'Future',
}

function formatNumber(n: number) {
  return n.toLocaleString('en-AU')
}

function formatCurrency(n: number) {
  return `A$${n.toLocaleString('en-AU', { minimumFractionDigits: 0 })}`
}

function DonutChart({ data }: { data: { type: string; pct: number }[] }) {
  const size = 220
  const strokeWidth = 40
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((seg, i) => {
          const dashLength = (seg.pct / 100) * circumference
          const dashOffset = -offset
          offset += dashLength
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={typeColors[seg.type] || '#666'}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          )
        })}
      </svg>
      <div className="flex flex-wrap justify-center gap-4">
        {data.map((seg) => (
          <div key={seg.type} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: typeColors[seg.type] || '#666' }} />
            <span className="text-xs text-brand-muted">
              {typeLabels[seg.type] || seg.type} ({seg.pct.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CapTablePage() {
  const [entries, setEntries] = useState<CapTableEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cap-table')
      .then((r) => r.json())
      .then((d) => { setEntries(d.entries || []); setLoading(false) })
  }, [])

  const totalShares = entries.reduce((sum, e) => sum + e.shares_held, 0)

  // Group by entity_type for chart
  const byType: Record<string, number> = {}
  entries.forEach((e) => {
    byType[e.entity_type] = (byType[e.entity_type] || 0) + e.shares_held
  })
  const chartData = Object.entries(byType).map(([type, shares]) => ({
    type,
    pct: totalShares > 0 ? (shares / totalShares) * 100 : 0,
  }))

  if (loading) {
    return <div className="p-8 text-center text-brand-muted text-sm">Loading...</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-brand-text">Cap Table</h1>
        <p className="text-sm text-brand-muted mt-1">Current ownership structure</p>
      </div>

      {entries.length === 0 ? (
        <Card padding="lg">
          <p className="text-center text-brand-muted text-sm py-8">Cap table data not yet available.</p>
        </Card>
      ) : (
        <>
          <Card padding="sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border">
                    <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase">Shareholder</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase">Share Class</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted uppercase">Shares</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted uppercase">Ownership %</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted uppercase">Investment</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id} className="border-b border-brand-border last:border-0 hover:bg-brand-card/50">
                      <td className="px-4 py-3 text-sm text-brand-text font-medium">{e.shareholder}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${typeColors[e.entity_type]}20`, color: typeColors[e.entity_type] }}>
                          {typeLabels[e.entity_type] || e.entity_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-brand-muted">{e.share_class}</td>
                      <td className="px-4 py-3 text-sm text-brand-text text-right">{formatNumber(e.shares_held)}</td>
                      <td className="px-4 py-3 text-sm text-brand-gold text-right font-medium">{e.ownership_percentage.toFixed(2)}%</td>
                      <td className="px-4 py-3 text-sm text-brand-muted text-right">{e.investment_amount > 0 ? formatCurrency(e.investment_amount) : '—'}</td>
                    </tr>
                  ))}
                  <tr className="bg-brand-card/30">
                    <td className="px-4 py-3 text-sm font-semibold text-brand-text" colSpan={3}>Total</td>
                    <td className="px-4 py-3 text-sm font-semibold text-brand-text text-right">{formatNumber(totalShares)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-brand-gold text-right">100.00%</td>
                    <td className="px-4 py-3 text-sm font-semibold text-brand-muted text-right">
                      {formatCurrency(entries.reduce((sum, e) => sum + e.investment_amount, 0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-sm font-semibold text-brand-text mb-4 text-center">Ownership Breakdown</h2>
            <DonutChart data={chartData} />
          </Card>
        </>
      )}

      <div className="space-y-1">
        <p className="text-xs text-brand-muted">Cap table is indicative and subject to change. Final allocation confirmed upon close of each funding round.</p>
        <p className="text-xs text-brand-muted">Pro forma cap table reflecting post-round ownership is available upon request.</p>
      </div>
    </div>
  )
}
