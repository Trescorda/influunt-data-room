'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import type { FAQ } from '@/lib/types'

const defaultCategories = ['Company & Product', 'Investment', 'Regulatory & Compliance', 'Partners & Technology', 'Risk', 'Process']

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ question: '', answer: '', category: defaultCategories[0], is_published: true, sort_order: 0 })
  const [saving, setSaving] = useState(false)

  const loadFaqs = async () => {
    const res = await fetch('/api/admin/faq')
    const d = await res.json()
    setFaqs(d.faqs || [])
    setLoading(false)
  }

  useEffect(() => { loadFaqs() }, [])

  const openCreate = () => {
    setEditingFaq(null)
    setForm({ question: '', answer: '', category: defaultCategories[0], is_published: true, sort_order: faqs.length })
    setShowModal(true)
  }

  const openEdit = (faq: FAQ) => {
    setEditingFaq(faq)
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, is_published: faq.is_published, sort_order: faq.sort_order })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editingFaq) {
      await fetch('/api/admin/faq', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingFaq.id, ...form }),
      })
    } else {
      await fetch('/api/admin/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    setSaving(false)
    setShowModal(false)
    loadFaqs()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch('/api/admin/faq', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteId }),
    })
    setDeleteId(null)
    loadFaqs()
  }

  const togglePublished = async (faq: FAQ) => {
    await fetch('/api/admin/faq', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: faq.id, is_published: !faq.is_published }),
    })
    loadFaqs()
  }

  const categories = [...new Set(faqs.map((f) => f.category))]
  const allCategories = [...new Set([...defaultCategories, ...categories])]

  if (loading) return <div className="p-8 text-center text-brand-muted text-sm">Loading...</div>

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-brand-text">FAQ Management</h1>
          <p className="text-sm text-brand-muted mt-1">Manage frequently asked questions</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} className="mr-2" /> Add FAQ</Button>
      </div>

      {faqs.length === 0 ? (
        <Card padding="lg">
          <p className="text-center text-brand-muted text-sm py-8">No FAQs yet. Add your first FAQ.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <h2 className="text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2">{cat}</h2>
              <Card padding="sm">
                <div className="divide-y divide-brand-border">
                  {faqs.filter((f) => f.category === cat).map((faq) => (
                    <div key={faq.id} className={`flex items-center gap-3 px-4 py-3 ${!faq.is_published ? 'opacity-40' : ''}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-brand-text truncate">{faq.question}</p>
                        <p className="text-xs text-brand-muted truncate mt-0.5">{faq.answer}</p>
                      </div>
                      <span className="text-xs text-brand-muted flex-shrink-0">#{faq.sort_order}</span>
                      <button onClick={() => togglePublished(faq)} className="flex-shrink-0">
                        <Badge variant={faq.is_published ? 'green' : 'gray'}>
                          {faq.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </button>
                      <button onClick={() => openEdit(faq)} className="text-brand-muted hover:text-brand-gold transition-colors flex-shrink-0">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(faq.id)} className="text-brand-muted hover:text-red-400 transition-colors flex-shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingFaq ? 'Edit FAQ' : 'Add FAQ'}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-brand-text">Question</label>
            <textarea
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/50 resize-none"
              placeholder="What is...?"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-brand-text">Answer</label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/50 resize-y"
              placeholder="The answer is..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-brand-text">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
            >
              {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 accent-brand-gold" />
              <span className="text-sm text-brand-text">Published</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-brand-muted">Order:</span>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-16 px-2 py-1 bg-brand-dark border border-brand-border rounded text-sm text-brand-text" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} loading={saving} disabled={!form.question.trim() || !form.answer.trim()} className="flex-1">
              {editingFaq ? 'Update' : 'Add FAQ'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete FAQ">
        <p className="text-sm text-brand-muted mb-4">Are you sure? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
