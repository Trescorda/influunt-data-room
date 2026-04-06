'use client'

import { useState } from 'react'
import {
  ChevronDown, ChevronRight, Folder, Briefcase, Scale, Shield,
  BarChart3, Code, Handshake, TrendingUp, Users,
} from 'lucide-react'
import { DocumentCard } from './DocumentCard'
import type { FolderWithDocuments } from '@/lib/types'

const iconMap: Record<string, any> = {
  briefcase: Briefcase,
  scale: Scale,
  shield: Shield,
  chart: BarChart3,
  code: Code,
  handshake: Handshake,
  'trending-up': TrendingUp,
  users: Users,
  folder: Folder,
}

function SubfolderSection({ folder }: { folder: FolderWithDocuments }) {
  const [open, setOpen] = useState(false)
  const docCount = folder.documents.length

  return (
    <div className="ml-5 border-l-2 border-brand-border/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-brand-card/40 transition-colors text-left"
      >
        <Folder size={13} className="text-brand-muted flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-brand-text">{folder.name}</h4>
          {folder.description && (
            <p className="text-[11px] text-brand-muted mt-0.5 truncate">{folder.description}</p>
          )}
        </div>
        <span className="text-[11px] text-brand-muted mr-1">
          {docCount} {docCount === 1 ? 'doc' : 'docs'}
        </span>
        {open ? (
          <ChevronDown size={13} className="text-brand-muted" />
        ) : (
          <ChevronRight size={13} className="text-brand-muted" />
        )}
      </button>
      {open && docCount > 0 && (
        <div className="ml-4 px-2 py-1 space-y-0.5">
          {folder.documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
      {open && docCount === 0 && (
        <div className="ml-4 px-4 py-3 text-[11px] text-brand-muted italic">
          No documents yet
        </div>
      )}
    </div>
  )
}

export function FolderSection({ folder }: { folder: FolderWithDocuments }) {
  const [open, setOpen] = useState(false)

  const FolderIcon = iconMap[folder.icon] || Folder
  const directDocCount = folder.documents.length
  const subfolderDocCount = (folder.subfolders || []).reduce((sum, sf) => sum + sf.documents.length, 0)
  const totalDocs = directDocCount + subfolderDocCount
  const hasSubfolders = (folder.subfolders || []).length > 0

  return (
    <div className="border border-brand-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-2.5 bg-brand-card hover:bg-brand-card/80 transition-colors text-left"
      >
        <div className="flex-shrink-0 w-7 h-7 bg-brand-gold/10 rounded flex items-center justify-center">
          <FolderIcon size={14} className="text-brand-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-brand-text">{folder.name}</h3>
          {folder.description && (
            <p className="text-[11px] text-brand-muted mt-0.5 truncate">{folder.description}</p>
          )}
        </div>
        <span className="text-xs text-brand-muted mr-2">
          {totalDocs} {totalDocs === 1 ? 'document' : 'documents'}
        </span>
        {open ? (
          <ChevronDown size={16} className="text-brand-muted" />
        ) : (
          <ChevronRight size={16} className="text-brand-muted" />
        )}
      </button>
      {open && (
        <div className="bg-brand-darker">
          {/* Direct documents in this folder */}
          {directDocCount > 0 && (
            <div className="px-2 py-2 space-y-0.5">
              {folder.documents.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}

          {/* Subfolders */}
          {hasSubfolders && (
            <div className="py-1">
              {(folder.subfolders || []).map((sf) => (
                <SubfolderSection key={sf.id} folder={sf} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {totalDocs === 0 && !hasSubfolders && (
            <div className="px-5 py-4 text-center text-xs text-brand-muted italic">
              No documents uploaded yet
            </div>
          )}
        </div>
      )}
    </div>
  )
}
