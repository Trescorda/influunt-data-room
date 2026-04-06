import { createClient } from '@/lib/supabase/server'
import { GuidedJourney } from '@/components/GuidedJourney'
import { CapitalTimeline } from '@/components/CapitalTimeline'
import { FolderSection } from '@/components/documents/FolderSection'
import type { FolderWithDocuments } from '@/lib/types'

export default async function RoomPage() {
  const supabase = await createClient()

  const { data: folders } = await supabase
    .from('document_folders')
    .select('*')
    .order('sort_order')

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('is_viewable', true)
    .order('sort_order')

  const foldersWithDocs: FolderWithDocuments[] = (folders || []).map((folder) => ({
    ...folder,
    documents: (documents || []).filter((doc) => doc.folder_id === folder.id),
  }))

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GuidedJourney />
        </div>
        <div>
          <CapitalTimeline />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-brand-text mb-1">All documents</h2>
        <p className="text-sm text-brand-muted mb-5">
          Explore detailed materials by category
        </p>
        <div className="space-y-3">
          {foldersWithDocs.map((folder) => (
            <FolderSection key={folder.id} folder={folder} />
          ))}
        </div>
      </div>
    </div>
  )
}
