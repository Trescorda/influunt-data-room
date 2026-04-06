import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { GuidedJourney } from '@/components/GuidedJourney'
import { CapitalTimeline } from '@/components/CapitalTimeline'
import { FolderSection } from '@/components/documents/FolderSection'
import type { FolderWithDocuments } from '@/lib/types'

export default async function RoomPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  const { data: folders } = await admin
    .from('document_folders')
    .select('*')
    .order('sort_order')

  const { data: documents } = await admin
    .from('documents')
    .select('*')
    .eq('is_viewable', true)
    .order('sort_order')

  const foldersWithDocs: FolderWithDocuments[] = (folders || []).map((folder) => ({
    ...folder,
    documents: (documents || []).filter((doc) => doc.folder_id === folder.id),
  }))

  // Build journey steps from actual documents
  // Map: step 1 & 2 → "The opportunity" folder (first two docs)
  // step 3 → "Technical architecture" or presentation
  // step 4 → "Traction & evidence" or financials
  // step 5 → Q&A (hardcoded)
  const opportunityFolder = foldersWithDocs.find((f) => f.name.toLowerCase().includes('opportunity'))
  const technicalFolder = foldersWithDocs.find((f) => f.name.toLowerCase().includes('technical'))
  const tractionFolder = foldersWithDocs.find((f) => f.name.toLowerCase().includes('traction'))

  const journeyDocs = [
    opportunityFolder?.documents[0] || null,
    opportunityFolder?.documents[1] || null,
    technicalFolder?.documents[0] || null,
    tractionFolder?.documents[0] || null,
    null, // Q&A step — always links to /room/qa
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GuidedJourney documents={journeyDocs} />
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
