import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/Badge'
import { DocumentViewer } from '@/components/documents/DocumentViewer'
import { ArrowLeft, FileText, Lock, Download } from 'lucide-react'
import Link from 'next/link'

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  const { data: document } = await admin
    .from('documents')
    .select('*, document_folders(name)')
    .eq('id', id)
    .single()

  if (!document) notFound()

  const { data: investor } = await admin
    .from('investors')
    .select('id, name, email')
    .eq('auth_user_id', user.id)
    .single()

  if (!investor) redirect('/login')

  const { data: settings } = await admin
    .from('settings')
    .select('watermark_opacity')
    .single()

  return (
    <div className="flex flex-col h-[calc(100vh-65px)]">
      {/* Fixed header */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-brand-border bg-brand-darker">
        <div className="flex items-center justify-between max-w-[950px] mx-auto">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/room"
              className="flex-shrink-0 text-brand-muted hover:text-brand-gold transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="w-10 h-10 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-brand-gold" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-brand-text truncate">{document.title}</h1>
              <div className="flex items-center gap-2 mt-0.5">
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
      </div>

      {/* Scrollable document area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[950px] mx-auto">
          <DocumentViewer
            docId={document.id}
            fileType={document.file_type}
            isDownloadable={document.is_downloadable}
            isWatermarked={document.is_watermarked}
            watermarkOpacity={settings?.watermark_opacity ?? 6}
            investorName={investor.name}
            investorEmail={investor.email}
          />
        </div>
      </div>
    </div>
  )
}
