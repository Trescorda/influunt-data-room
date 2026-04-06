'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MessageSquare, Send } from 'lucide-react'

interface QuestionWithInvestor {
  id: string
  question: string
  answer: string | null
  status: string
  created_at: string
  answered_at: string | null
  investors: { name: string; email: string; organisation: string | null } | null
}

export default function AdminQAPage() {
  const [questions, setQuestions] = useState<QuestionWithInvestor[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all')
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  const loadQuestions = async () => {
    // Use fetch to an API route to bypass RLS
    const res = await fetch('/api/admin/questions')
    const data = await res.json()
    setQuestions(data.questions || [])
    setLoading(false)
  }

  useEffect(() => {
    loadQuestions()
  }, [])

  const handleAnswer = async (questionId: string) => {
    if (!answerText.trim()) return
    setSubmitting(true)

    await fetch('/api/admin/questions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: questionId, answer: answerText.trim() }),
    })

    setAnswerText('')
    setExpandedId(null)
    setSubmitting(false)
    loadQuestions()
  }

  const filtered = questions.filter((q) => {
    if (filter === 'all') return true
    return q.status === filter
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-brand-text">Q&A Management</h1>
          <p className="text-sm text-brand-muted mt-1">View and answer investor questions</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'answered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === f
                  ? 'bg-brand-gold/10 text-brand-gold'
                  : 'text-brand-muted hover:text-brand-text hover:bg-brand-card'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-brand-muted text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare size={32} className="text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">No questions {filter !== 'all' ? `with status "${filter}"` : 'yet'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <Card key={q.id} padding="md">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-brand-gold">
                      {q.investors?.name || 'Unknown'}
                    </span>
                    <span className="text-xs text-brand-muted">
                      {q.investors?.organisation || ''}
                    </span>
                  </div>
                  <p className="text-sm text-brand-text">{q.question}</p>
                </div>
                <Badge variant={q.status === 'answered' ? 'green' : 'gold'}>
                  {q.status}
                </Badge>
              </div>

              {q.answer && (
                <div className="mt-3 pt-3 border-t border-brand-border">
                  <p className="text-xs text-brand-muted mb-1">Answer:</p>
                  <p className="text-sm text-brand-text/80">{q.answer}</p>
                </div>
              )}

              {q.status === 'pending' && (
                <div className="mt-3 pt-3 border-t border-brand-border">
                  {expandedId === q.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Type your answer..."
                        className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-lg text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/50 resize-none"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => { setExpandedId(null); setAnswerText('') }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          loading={submitting}
                          disabled={!answerText.trim()}
                          onClick={() => handleAnswer(q.id)}
                        >
                          <Send size={12} className="mr-1" />
                          Submit answer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setExpandedId(q.id); setAnswerText('') }}
                    >
                      Write answer
                    </Button>
                  )}
                </div>
              )}

              <p className="text-xs text-brand-muted mt-2">
                Asked {new Date(q.created_at).toLocaleDateString()}
                {q.answered_at && ` &middot; Answered ${new Date(q.answered_at).toLocaleDateString()}`}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
