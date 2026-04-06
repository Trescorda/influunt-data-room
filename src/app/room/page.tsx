import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { GuidedJourney } from '@/components/GuidedJourney'
import { CapitalTimeline } from '@/components/CapitalTimeline'
import { FolderSection } from '@/components/documents/FolderSection'
import type { FolderWithDocuments, DocumentFolder, Document } from '@/lib/types'

function buildFolderTree(folders: DocumentFolder[], documents: Document[]): FolderWithDocuments[] {
  // IDs that are referenced as parents
  const parentIds = new Set(folders.filter((f) => f.parent_id).map((f) => f.parent_id))

  // Top-level folders (no parent)
  const topLevel = folders.filter((f) => !f.parent_id).sort((a, b) => a.sort_order - b.sort_order)

  return topLevel
    .map((folder) => {
      const subs = folders
        .filter((f) => f.parent_id === folder.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((sf) => ({
          ...sf,
          documents: documents.filter((d) => d.folder_id === sf.id),
          subfolders: [],
        }))

      const directDocs = documents.filter((d) => d.folder_id === folder.id)

      return {
        ...folder,
        documents: directDocs,
        subfolders: subs,
      }
    })
    // Hide empty top-level folders that have no subfolders and no documents
    // (these are likely orphaned old folders from before subfolder migration)
    .filter((f) => f.documents.length > 0 || (f.subfolders && f.subfolders.length > 0))
}

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

  const folderTree = buildFolderTree(folders || [], documents || [])

  // Flatten all folders for journey step matching (includes subfolders)
  const allFoldersWithDocs: FolderWithDocuments[] = (folders || []).map((folder) => ({
    ...folder,
    documents: (documents || []).filter((doc) => doc.folder_id === folder.id),
  }))

  const findFolder = (...keywords: string[]) =>
    allFoldersWithDocs.find((f) => {
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
    null,
  ]

  return (
    <div className="px-8 py-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <GuidedJourney documents={journeyDocs} />
        </div>
        <div>
          <CapitalTimeline />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-brand-text mb-1">All documents</h2>
        <p className="text-sm text-[#999] mb-4">
          Explore detailed materials by category
        </p>
        <div className="space-y-3">
          {folderTree.map((folder) => (
            <FolderSection key={folder.id} folder={folder} />
          ))}
        </div>
      </div>
    </div>
  )
}
