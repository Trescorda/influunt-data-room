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

  const { data: folders, error: foldersError } = await admin
    .from('document_folders')
    .select('*')
    .order('sort_order')

  const { data: documents, error: docsError } = await admin
    .from('documents')
    .select('*')
    .eq('is_viewable', true)
    .order('sort_order')

  // Debug: also fetch ALL documents with no filters
  const { data: allDocs, error: allDocsError } = await admin
    .from('documents')
    .select('id, title, folder_id, is_viewable, file_path')

  console.log('[Room] Folders:', folders?.length, 'error:', foldersError?.message)
  console.log('[Room] Viewable documents:', documents?.length, 'error:', docsError?.message)
  console.log('[Room] ALL documents (no filter):', allDocs?.length, 'error:', allDocsError?.message)
  if (allDocs?.length) {
    allDocs.forEach((d) => console.log('[Room] Doc:', d.id, d.title, 'folder:', d.folder_id, 'viewable:', d.is_viewable))
  }
  if (folders?.length) {
    folders.forEach((f) => console.log('[Room] Folder:', f.id, f.name))
  }

  const foldersWithDocs: FolderWithDocuments[] = (folders || []).map((folder) => ({
    ...folder,
    documents: (documents || []).filter((doc) => doc.folder_id === folder.id),
  }))

  // Build journey steps from actual documents
  // Match folders by name keywords (case-insensitive)
  const findFolder = (...keywords: string[]) =>
    foldersWithDocs.find((f) => {
      const name = f.name.toLowerCase()
      return keywords.some((k) => name.includes(k))
    })

  const opportunityFolder = findFolder('opportunity')
  const technicalFolder = findFolder('technical', 'architecture', 'presentation')
  const financialsFolder = findFolder('financial', 'numbers', 'traction')

  const journeyDocs = [
    opportunityFolder?.documents[0] || null,
    opportunityFolder?.documents[1] || null,
    technicalFolder?.documents[0] || null,
    financialsFolder?.documents[0] || null,
    null, // Q&A step — always links to /room/qa
  ]

  return (
    <div className="px-6 py-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <GuidedJourney documents={journeyDocs} />
        </div>
        <div>
          <CapitalTimeline />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-brand-text mb-0.5">All documents</h2>
        <p className="text-xs text-brand-muted mb-3">
          Explore detailed materials by category
        </p>
        <div className="space-y-2">
          {foldersWithDocs.map((folder) => (
            <FolderSection key={folder.id} folder={folder} />
          ))}
        </div>
      </div>
    </div>
  )
}
