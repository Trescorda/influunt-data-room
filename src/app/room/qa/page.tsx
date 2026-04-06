'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { MessageSquare, Send, CheckCircle } from 'lucide-react'
import type { Question } from '@/lib/types'

export default function QAPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  const loadQuestions = async () => {
    const res = await fetch('/api/questions')
    const data = await res.json()
    setQuestions(data.questions || [])
    setPageLoading(false)
  }

  useEffect(() => {
    loadQuestions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim()) return

    setLoading(true)
    setSuccess(false)

    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: newQuestion.trim() }),
    })
    const data = await res.json()

    if (res.ok && data.question) {
      setQuestions([data.question, ...questions])
      setNewQuestion('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-brand-text">Questions & Answers</h2>
        <p className="text-sm text-brand-muted mt-1">
          Ask the Influunt team anything about the opportunity
        </p>
      </div>

      <Card padding="md" className="mb-6">
        <form onSubmit={handleSubmit}>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-lg text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/50 resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between mt-3">
            {success ? (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle size={16} />
                Question submitted successfully
              </div>
            ) : (
              <div />
            )}
            <Button type="submit" loading={loading} disabled={!newQuestion.trim()}>
              <Send size={14} className="mr-2" />
              Submit question
            </Button>
          </div>
        </form>
      </Card>

      {pageLoading ? (
        <div className="py-12 text-center text-brand-muted text-sm">Loading...</div>
      ) : (
        <div className="space-y-3">
          {questions.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare size={32} className="text-brand-muted mx-auto mb-3" />
              <p className="text-sm text-brand-muted">No questions yet. Ask us anything!</p>
            </div>
          )}
          {questions.map((q) => (
            <Card key={q.id} padding="md">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-brand-text">{q.question}</p>
                <Badge variant={q.status === 'answered' ? 'green' : 'gold'}>
                  {q.status}
                </Badge>
              </div>
              {q.status === 'answered' && q.answer ? (
                <div className="mt-3 pt-3 border-t border-brand-border">
                  <p className="text-xs font-medium text-brand-gold mb-1">Influunt team:</p>
                  <p className="text-sm text-brand-text/80">{q.answer}</p>
                  <p className="text-xs text-brand-muted mt-2">
                    Answered {q.answered_at ? new Date(q.answered_at).toLocaleDateString() : ''}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-brand-muted mt-2 italic">Awaiting response</p>
              )}
              <p className="text-xs text-brand-muted mt-1">
                Asked {new Date(q.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
