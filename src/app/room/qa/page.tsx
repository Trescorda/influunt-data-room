'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { MessageSquare, Send } from 'lucide-react'
import type { Question } from '@/lib/types'

export default function QAPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [investorId, setInvestorId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: investor } = await supabase
        .from('investors')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      if (investor) {
        setInvestorId(investor.id)
        const { data } = await supabase
          .from('questions')
          .select('*')
          .eq('investor_id', investor.id)
          .order('created_at', { ascending: false })
        setQuestions(data || [])
      }
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim() || !investorId) return

    setLoading(true)
    const { data, error } = await supabase
      .from('questions')
      .insert({
        investor_id: investorId,
        question: newQuestion.trim(),
      })
      .select()
      .single()

    if (data) {
      setQuestions([data, ...questions])
      setNewQuestion('')

      await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_question' }),
      })
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
          <div className="flex justify-end mt-3">
            <Button type="submit" loading={loading} disabled={!newQuestion.trim()}>
              <Send size={14} className="mr-2" />
              Submit question
            </Button>
          </div>
        </form>
      </Card>

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
    </div>
  )
}
