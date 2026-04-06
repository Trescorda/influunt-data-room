'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Plus, Trash2, Save, ChevronDown } from 'lucide-react'
import type { CapTableEntry, CapTableEntityType } from '@/lib/types'

interface EditableEntry extends Omit<CapTableEntry, 'id' | 'created_at'> {
  id?: string
  _isNew?: boolean
}

const entityTypes: { value: CapTableEntityType; label: string }[] = [
  { value: 'founder', label: 'Founder' },
  { value: 'esop', label: 'ESOP' },
  { value: 'seed', label: 'Seed' },
  { value: 'future', label: 'Future' },
]

const typeLabels: Record<string, string> = {
  founder: 'Founder',
  esop: 'ESOP',
  seed: 'Seed',
  future: 'Future',
}

function formatNumberDisplay(n: number): string {
  return n.toLocaleString('en-AU')
}

function formatCurrencyDisplay(n: number): string {
  return `$${n.toLocaleString('en-AU', { minimumFractionDigits: 0 })}`
}

export default function AdminCapTablePage() {
  const [entries, setEntries] = useState<EditableEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; field: string } | null>(null)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    fetch('/api/admin/cap-table')
      .then((r) => r.json())
      .then((d) => {
        console.log('[CapTable] Loaded entries:', d.entries)
        setEntries(d.entries || [])
        setLoading(false)
      })
  }, [])

  const recalcPercentages = (rows: EditableEntry[]): EditableEntry[] => {
    const total = rows.reduce((sum, r) => sum + (r.shares_held || 0), 0)
    return rows.map((r) => ({
      ...r,
      ownership_percentage: total > 0 ? (r.shares_held / total) * 100 : 0,
    }))
  }

  const updateField = (index: number, field: string, value: any) => {
    const updated = [...entries]
    ;(updated[index] as any)[field] = value
    if (field === 'shares_held') {
      setEntries(recalcPercentages(updated))
    } else {
      setEntries(updated)
    }
  }

  const addRow = () => {
    setEntries([...entries, {
      _isNew: true,
      shareholder_name: '',
      entity_type: 'seed',
      share_class: 'Ordinary',
      shares_held: 0,
      ownership_percentage: 0,
      investment_amount: 0,
      sort_order: entries.length,
    }])
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError('')
    const res = await fetch('/api/admin/cap-table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries }),
    })
    const result = await res.json()
    setSaving(false)
    if (!res.ok) {
      setSaveError(result.error || 'Failed to save')
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    const reloadRes = await fetch('/api/admin/cap-table')
    const d = await reloadRes.json()
    setEntries(d.entries || [])
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch('/api/admin/cap-table', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteId }),
    })
    setEntries(recalcPercentages(entries.filter((e) => e.id !== deleteId)))
    setDeleteId(null)
  }

  const isEditing = (row: number, field: string) =>
    editingCell?.row === row && editingCell?.field === field

  if (loading) return <div className="p-8 text-center text-brand-muted text-sm">Loading...</div>

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-brand-text">Cap Table</h1>
          <p className="text-sm text-brand-muted mt-1">Manage ownership structure</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          <Save size={16} className="mr-2" />
          {saved ? 'Saved!' : 'Save changes'}
        </Button>
      </div>

      {saveError && (
        <p className="text-sm text-red-400 mb-4">{saveError}</p>
      )}

      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '800px' }}>
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left px-3 py-2.5 text-xs font-medium text-brand-muted uppercase tracking-wider" style={{ width: '22%' }}>Shareholder</th>
                <th className="text-left px-3 py-2.5 text-xs font-medium text-brand-muted uppercase tracking-wider" style={{ width: '12%' }}>Type</th>
                <th className="text-left px-3 py-2.5 text-xs font-medium text-brand-muted uppercase tracking-wider" style={{ width: '12%' }}>Class</th>
                <th className="text-right px-3 py-2.5 text-xs font-medium text-brand-muted uppercase tracking-wider" style={{ width: '14%' }}>Shares</th>
                <th className="text-right px-3 py-2.5 text-xs font-medium text-brand-muted uppercase tracking-wider" style={{ width: '10%' }}>Ownership</th>
                <th className="text-right px-3 py-2.5 text-xs font-medium text-brand-muted uppercase tracking-wider" style={{ width: '16%' }}>Investment</th>
                <th className="text-center px-3 py-2.5 text-xs font-medium text-brand-muted uppercase tracking-wider" style={{ width: '8%' }}>Sort</th>
                <th className="px-3 py-2.5" style={{ width: '6%' }}></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.id || `new-${i}`} className="border-b border-brand-border last:border-0 hover:bg-brand-card/30">
                  {/* Shareholder */}
                  <td className="px-3 py-2">
                    <input
                      value={e.shareholder_name || ''}
                      onChange={(ev) => updateField(i, 'shareholder_name', ev.target.value)}
                      className="w-full bg-transparent text-sm text-brand-text border-b border-transparent hover:border-brand-border focus:border-brand-gold outline-none py-1"
                      placeholder="Enter name"
                    />
                  </td>
                  {/* Type */}
                  <td className="px-3 py-2">
                    <div className="relative">
                      <select
                        value={e.entity_type}
                        onChange={(ev) => updateField(i, 'entity_type', ev.target.value)}
                        className="w-full appearance-none bg-brand-card text-sm text-brand-gold border border-brand-border rounded-md px-3 py-1.5 pr-8 cursor-pointer outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold"
                      >
                        {entityTypes.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                    </div>
                  </td>
                  {/* Class */}
                  <td className="px-3 py-2">
                    <input
                      value={e.share_class}
                      onChange={(ev) => updateField(i, 'share_class', ev.target.value)}
                      className="w-full bg-transparent text-sm text-brand-muted border-b border-transparent hover:border-brand-border focus:border-brand-gold outline-none py-1"
                    />
                  </td>
                  {/* Shares — show formatted, edit raw */}
                  <td className="px-3 py-2">
                    {isEditing(i, 'shares') ? (
                      <input
                        type="number"
                        value={e.shares_held}
                        onChange={(ev) => updateField(i, 'shares_held', parseInt(ev.target.value) || 0)}
                        onBlur={() => setEditingCell(null)}
                        autoFocus
                        className="w-full bg-transparent text-sm text-brand-text text-right border-b border-brand-gold outline-none py-1"
                      />
                    ) : (
                      <div
                        onClick={() => setEditingCell({ row: i, field: 'shares' })}
                        className="text-sm text-brand-text text-right py-1 cursor-pointer border-b border-transparent hover:border-brand-border"
                      >
                        {formatNumberDisplay(e.shares_held)}
                      </div>
                    )}
                  </td>
                  {/* Ownership % */}
                  <td className="px-3 py-2 text-sm text-brand-gold text-right font-medium">
                    {e.ownership_percentage.toFixed(2)}%
                  </td>
                  {/* Investment — show formatted, edit raw */}
                  <td className="px-3 py-2">
                    {isEditing(i, 'investment') ? (
                      <input
                        type="number"
                        value={e.investment_amount}
                        onChange={(ev) => updateField(i, 'investment_amount', parseFloat(ev.target.value) || 0)}
                        onBlur={() => setEditingCell(null)}
                        autoFocus
                        className="w-full bg-transparent text-sm text-brand-text text-right border-b border-brand-gold outline-none py-1"
                      />
                    ) : (
                      <div
                        onClick={() => setEditingCell({ row: i, field: 'investment' })}
                        className="text-sm text-brand-muted text-right py-1 cursor-pointer border-b border-transparent hover:border-brand-border"
                      >
                        {formatCurrencyDisplay(e.investment_amount)}
                      </div>
                    )}
                  </td>
                  {/* Sort */}
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={e.sort_order}
                      onChange={(ev) => updateField(i, 'sort_order', parseInt(ev.target.value) || 0)}
                      className="w-[60px] mx-auto block bg-brand-card text-sm text-brand-muted text-center rounded border border-transparent focus:border-brand-gold outline-none py-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                    />
                  </td>
                  {/* Delete */}
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => e.id ? setDeleteId(e.id) : setEntries(recalcPercentages(entries.filter((_, j) => j !== i)))}
                      className="text-brand-muted hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-3 py-3 border-t border-brand-border">
          <Button variant="ghost" size="sm" onClick={addRow}>
            <Plus size={14} className="mr-1" /> Add row
          </Button>
        </div>
      </Card>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete row">
        <p className="text-sm text-brand-muted mb-4">Are you sure? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
