'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MessageSquare, Send, CheckCircle } from 'lucide-react'

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
  // Per-row answer drafts so each pending question keeps its own text
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({})
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const loadQuestions = async () => {
    try {
      const res = await fetch('/api/admin/questions')
      const data = await res.json()
      console.log('[Admin Q&A] Loaded:', data.questions?.length, 'error:', data.error)
      setQuestions(data.questions || [])
    } catch (err) {
      console.error('[Admin Q&A] Fetch failed:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadQuestions()
  }, [])

  const handleAnswer = async (questionId: string) => {
    const text = (answerDrafts[questionId] || '').trim()
    if (!text) return
    setSubmittingId(questionId)
    setError('')

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: questionId, answer: text }),
      })
      const result = await res.json()
      console.log('[Admin Q&A] Answer response:', { status: res.status, result })

      if (!res.ok) {
        setError(result.error || 'Failed to save answer')
        setSubmittingId(null)
        return
      }

      // Clear the draft + show success toast for this row
      setAnswerDrafts((d) => {
        const next = { ...d }
        delete next[questionId]
        return next
      })
      setSuccessId(questionId)
      setTimeout(() => setSuccessId(null), 3000)
      await loadQuestions()
    } catch (err) {
      console.error('[Admin Q&A] Submit failed:', err)
      setError('Network error — please try again')
    }
    setSubmittingId(null)
  }

  const filtered = questions.filter((q) => {
    if (filter === 'all') return true
    return q.status === filter
  })

  return (
    <div className="px-4 md:px-8 py-4 md:py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-inf-green">Q&A Management</h1>
          <p className="text-sm text-inf-muted mt-1">View and answer investor questions</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'answered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-inf transition-colors ${
                filter === f
                  ? 'bg-inf-gold/[0.12] text-inf-gold-deep'
                  : 'text-inf-muted hover:text-inf-green hover:bg-inf-green/[0.06]'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-600/[0.08] border border-red-600/25 rounded-inf text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-inf-muted text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare size={32} className="text-inf-green/30 mx-auto mb-3" />
          <p className="text-sm text-inf-muted">
            No questions {filter !== 'all' ? `with status "${filter}"` : 'yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => {
            const draft = answerDrafts[q.id] ?? ''
            const isSubmitting = submittingId === q.id
            const justSaved = successId === q.id
            return (
              <Card key={q.id} padding="md">
                {/* Question header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-inf-green">
                        {q.investors?.name || 'Unknown'}
                      </span>
                      {q.investors?.organisation && (
                        <span className="text-xs text-inf-muted">
                          {q.investors.organisation}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-inf-body">{q.question}</p>
                  </div>
                  <Badge variant={q.status === 'answered' ? 'green' : 'gold'}>
                    {q.status}
                  </Badge>
                </div>

                {/* Existing answer (if answered) */}
                {q.status === 'answered' && q.answer && (
                  <div className="mt-3 pt-3 border-t border-inf-line">
                    <p className="inf-label mb-1.5">Your response:</p>
                    <p className="text-sm text-inf-body whitespace-pre-wrap">{q.answer}</p>
                  </div>
                )}

                {/* Always-visible answer form for pending questions */}
                {q.status === 'pending' && (
                  <div className="mt-3 pt-3 border-t border-inf-line space-y-3">
                    <textarea
                      value={draft}
                      onChange={(e) => setAnswerDrafts((d) => ({ ...d, [q.id]: e.target.value }))}
                      placeholder="Write your answer..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-inf-line-strong rounded-inf text-sm text-inf-body placeholder:text-inf-subtle outline-none hover:border-inf-gold/40 focus:border-inf-gold/60 focus:ring-1 focus:ring-inf-gold/30 transition-all duration-200 resize-y"
                    />
                    <div className="flex items-center justify-between gap-3">
                      {justSaved ? (
                        <div className="flex items-center gap-2 text-inf-green-600 text-sm font-medium">
                          <CheckCircle size={16} />
                          Answer sent
                        </div>
                      ) : (
                        <div />
                      )}
                      <Button
                        size="sm"
                        loading={isSubmitting}
                        disabled={!draft.trim()}
                        onClick={() => handleAnswer(q.id)}
                      >
                        <Send size={12} className="mr-2" />
                        Submit Answer
                      </Button>
                    </div>
                  </div>
                )}

                {/* Success toast for newly-answered (just transitioned) */}
                {justSaved && q.status === 'answered' && (
                  <div className="mt-3 flex items-center gap-2 text-inf-green-600 text-sm font-medium">
                    <CheckCircle size={16} />
                    Answer saved and investor notified
                  </div>
                )}

                {/* Metadata footer */}
                <p className="text-xs text-inf-muted mt-3" data-numeric>
                  Asked on {formatDateTime(q.created_at)}
                  {q.answered_at && (
                    <>
                      {' · '}
                      Answered on {formatDateTime(q.answered_at)}
                    </>
                  )}
                </p>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
