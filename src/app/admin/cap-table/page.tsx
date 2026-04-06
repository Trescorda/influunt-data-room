'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Plus, Trash2, Save } from 'lucide-react'
import type { CapTableEntry, CapTableEntityType } from '@/lib/types'

interface EditableEntry extends Omit<CapTableEntry, 'id' | 'created_at'> {
  id?: string
  _isNew?: boolean
}

export default function AdminCapTablePage() {
  const [entries, setEntries] = useState<EditableEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/cap-table')
      .then((r) => r.json())
      .then((d) => { setEntries(d.entries || []); setLoading(false) })
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
      shareholder: '',
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
    await fetch('/api/admin/cap-table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    // Reload
    const res = await fetch('/api/admin/cap-table')
    const d = await res.json()
    setEntries(d.entries || [])
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch('/api/admin/cap-table', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteId }),
    })
    setEntries(entries.filter((e) => e.id !== deleteId))
    setDeleteId(null)
  }

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

      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left px-3 py-2 text-xs font-medium text-brand-muted uppercase">Shareholder</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-brand-muted uppercase">Type</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-brand-muted uppercase">Class</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-brand-muted uppercase">Shares</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-brand-muted uppercase">%</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-brand-muted uppercase">Investment</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-brand-muted uppercase">Order</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.id || `new-${i}`} className="border-b border-brand-border last:border-0">
                  <td className="px-3 py-2">
                    <input
                      value={e.shareholder}
                      onChange={(ev) => updateField(i, 'shareholder', ev.target.value)}
                      className="w-full bg-transparent text-sm text-brand-text border-b border-transparent focus:border-brand-gold outline-none py-1"
                      placeholder="Name"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={e.entity_type}
                      onChange={(ev) => updateField(i, 'entity_type', ev.target.value)}
                      className="bg-brand-dark text-sm text-brand-text border border-brand-border rounded px-2 py-1"
                    >
                      <option value="founder">Founder</option>
                      <option value="esop">ESOP</option>
                      <option value="seed">Seed</option>
                      <option value="future">Future</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={e.share_class}
                      onChange={(ev) => updateField(i, 'share_class', ev.target.value)}
                      className="w-20 bg-transparent text-sm text-brand-muted border-b border-transparent focus:border-brand-gold outline-none py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={e.shares_held}
                      onChange={(ev) => updateField(i, 'shares_held', parseInt(ev.target.value) || 0)}
                      className="w-24 bg-transparent text-sm text-brand-text text-right border-b border-transparent focus:border-brand-gold outline-none py-1"
                    />
                  </td>
                  <td className="px-3 py-2 text-sm text-brand-gold text-right">{e.ownership_percentage.toFixed(2)}%</td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={e.investment_amount}
                      onChange={(ev) => updateField(i, 'investment_amount', parseFloat(ev.target.value) || 0)}
                      className="w-28 bg-transparent text-sm text-brand-muted text-right border-b border-transparent focus:border-brand-gold outline-none py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={e.sort_order}
                      onChange={(ev) => updateField(i, 'sort_order', parseInt(ev.target.value) || 0)}
                      className="w-12 bg-transparent text-sm text-brand-muted text-right border-b border-transparent focus:border-brand-gold outline-none py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => e.id ? setDeleteId(e.id) : setEntries(entries.filter((_, j) => j !== i))} className="text-brand-muted hover:text-red-400 transition-colors">
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
