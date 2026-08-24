'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Loading } from '@/components/ui/Loading'
import type { CapTableEntry } from '@/lib/types'

const typeColors: Record<string, string> = {
  founder: '#BA8535',
  investor: '#3FA986',
  advisor: '#794DB6',
  esop: '#348DCF',
  sweat_equity: '#5E6B01',
  gifted: '#C55C44',
  reserved: 'rgba(23,65,51,0.35)',
}

const typeLabels: Record<string, string> = {
  founder: 'Founder',
  investor: 'Investor',
  advisor: 'Advisor',
  esop: 'ESOP',
  sweat_equity: 'Sweat Equity',
  gifted: 'Gifted',
  reserved: 'Reserved',
}

function formatNumber(n: number) {
  return n.toLocaleString('en-AU')
}

function formatCurrency(n: number) {
  return `A$${n.toLocaleString('en-AU', { minimumFractionDigits: 0 })}`
}

function DonutChart({ data, totalShares }: { data: { type: string; pct: number }[]; totalShares: number }) {
  const size = 220
  const strokeWidth = 28
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const gap = data.length > 1 ? 2.5 : 0 // px breathing room between segments
  // Precompute each arc's start offset. Previously this accumulated into a
  // `let` inside the render pass, which mutates during render.
  const offsets = data.reduce<number[]>((acc, seg, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + (data[i - 1].pct / 100) * circumference)
    return acc
  }, [])

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {data.map((seg, i) => {
            const dashLength = Math.max((seg.pct / 100) * circumference - gap, 0)
            const dashOffset = -offsets[i]
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={typeColors[seg.type] || 'rgba(23,65,51,0.35)'}
                strokeWidth={strokeWidth}
                strokeLinecap={gap ? 'round' : 'butt'}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            )
          })}
        </svg>
        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-2xl font-bold text-inf-green" data-numeric>{formatNumber(totalShares)}</p>
          <p className="text-[11px] text-inf-muted uppercase tracking-[0.14em] mt-0.5">Total shares</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((seg) => (
          <div key={seg.type} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: typeColors[seg.type] || 'rgba(23,65,51,0.35)' }} />
            <span className="text-xs text-inf-muted" data-numeric>
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
    return <Loading />
  }

  return (
    <div className="px-4 md:px-8 py-4 md:py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-inf-green">Cap Table</h1>
        <p className="text-sm text-inf-muted mt-1">Current ownership structure</p>
      </div>

      {entries.length === 0 ? (
        <Card padding="lg">
          <p className="text-center text-inf-muted text-sm py-8">Cap table data not yet available.</p>
        </Card>
      ) : (
        <>
          <Card padding="sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-inf-green/[0.04]">
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Shareholder</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Type</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Share Class</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Shares</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Ownership %</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Investment</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id} className="border-t border-inf-line hover:bg-inf-gold/[0.04] transition-colors">
                      <td className="px-4 py-3 text-sm text-inf-green font-medium">{e.shareholder_name}</td>
                      <td className="px-4 py-3">
                        <span
                          className="text-[11px] font-semibold tracking-[0.04em] px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${typeColors[e.entity_type] || 'rgba(23,65,51,0.35)'} 14%, transparent)`,
                            color: `color-mix(in srgb, ${typeColors[e.entity_type] || 'rgba(23,65,51,0.35)'} 70%, #174133)`,
                          }}
                        >
                          {typeLabels[e.entity_type] || e.entity_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-inf-muted">{e.share_class}</td>
                      <td className="px-4 py-3 text-sm text-inf-body text-right">{formatNumber(e.shares_held)}</td>
                      <td className="px-4 py-3 text-sm text-inf-gold-deep text-right font-semibold">{e.ownership_percentage.toFixed(2)}%</td>
                      <td className="px-4 py-3 text-sm text-inf-muted text-right">{e.investment_amount > 0 ? formatCurrency(e.investment_amount) : '—'}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-inf-line-strong bg-inf-green/[0.03]">
                    <td className="px-4 py-3 text-sm font-semibold text-inf-green" colSpan={3}>Total</td>
                    <td className="px-4 py-3 text-sm font-semibold text-inf-green text-right">{formatNumber(totalShares)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-inf-gold-deep text-right">100.00%</td>
                    <td className="px-4 py-3 text-sm font-semibold text-inf-muted text-right">
                      {formatCurrency(entries.reduce((sum, e) => sum + e.investment_amount, 0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-sm font-semibold text-inf-green mb-4 text-center">Ownership Breakdown</h2>
            <DonutChart data={chartData} totalShares={totalShares} />
          </Card>
        </>
      )}

      <div className="space-y-1">
        <p className="text-xs text-inf-muted">Cap table is indicative and subject to change. Final allocation confirmed upon close of each funding round.</p>
        <p className="text-xs text-inf-muted">Pro forma cap table reflecting post-round ownership is available upon request.</p>
        <p className="text-xs text-inf-muted italic mt-2">Influunt&apos;s cap table is managed and verified through Cake Equity. Investors receive access to the Cake Equity portal upon completion of their investment to view their holdings in real time.</p>
      </div>
    </div>
  )
}
