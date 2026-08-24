import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { CapitalRoadmap } from '@/components/CapitalRoadmap'
import { FolderSection } from '@/components/documents/FolderSection'
import type { FolderWithDocuments, DocumentFolder, Document } from '@/lib/types'

function buildFolderTree(folders: DocumentFolder[], documents: Document[]): FolderWithDocuments[] {
  const topLevel = folders
    .filter((f) => !f.parent_id)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))

  return topLevel
    .map((folder) => {
      const subs = folders
        .filter((f) => f.parent_id === folder.id)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((sf) => ({
          ...sf,
          documents: documents.filter((d) => d.folder_id === sf.id),
          subfolders: [],
        }))
        .filter((sf) => sf.documents.length > 0)

      const directDocs = documents.filter((d) => d.folder_id === folder.id)

      return {
        ...folder,
        documents: directDocs,
        subfolders: subs,
      }
    })
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

  return (
    <div className="px-4 md:px-8 py-4 md:py-6 space-y-6">
      {/* Capital raise roadmap — full width */}
      <CapitalRoadmap />

      {/* All documents */}
      <div className="mt-8">
        <p className="inf-eyebrow text-[11px] mb-1.5">Due Diligence</p>
        <h2 className="text-xl font-bold text-inf-green mb-1">All documents</h2>
        <p className="text-sm text-inf-muted mb-4">
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
