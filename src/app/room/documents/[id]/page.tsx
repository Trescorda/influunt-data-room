import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/Badge'
import { DocumentViewer } from '@/components/documents/DocumentViewer'
import { ArrowLeft, FileText, Lock } from 'lucide-react'
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
    <div className="p-8 max-w-[950px] mx-auto">
      <Link
        href="/room"
        className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-gold transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to data room
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
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

      <DocumentViewer
        docId={document.id}
        fileType={document.file_type}
        isDownloadable={document.is_downloadable}
        isWatermarked={document.is_watermarked}
        investorName={investor.name}
        investorEmail={investor.email}
        watermarkOpacity={settings?.watermark_opacity ?? 15}
      />
    </div>
  )
}
