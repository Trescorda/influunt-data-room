import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, FileText, Download, Lock } from 'lucide-react'
import Link from 'next/link'

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: document } = await supabase
    .from('documents')
    .select('*, document_folders(name)')
    .eq('id', id)
    .single()

  if (!document) notFound()

  // Log view activity
  const { data: investor } = await supabase
    .from('investors')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (investor) {
    await supabase.from('activity_log').insert({
      investor_id: investor.id,
      action: 'view_document',
      document_id: document.id,
    })
  }

  return (
    <div className="p-8">
      <Link
        href="/room"
        className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-gold transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to data room
      </Link>

      <Card padding="lg">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-brand-gold" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-brand-text">{document.title}</h1>
              {document.description && (
                <p className="text-sm text-brand-muted mt-1">{document.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="gold">{document.file_type.toUpperCase()}</Badge>
                {document.is_watermarked && (
                  <Badge variant="gray">
                    <Lock size={10} className="mr-1" />
                    Watermarked
                  </Badge>
                )}
                <span className="text-xs text-brand-muted">v{document.version}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-darker rounded-lg border border-brand-border min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <FileText size={48} className="text-brand-muted mx-auto mb-4" />
            <p className="text-brand-muted text-sm">
              Document viewer will be available in Prompt 2
            </p>
            <p className="text-brand-muted text-xs mt-1">
              In-browser PDF rendering with watermarking
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
