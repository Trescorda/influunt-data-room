'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Folder } from 'lucide-react'
import { DocumentCard } from './DocumentCard'
import type { FolderWithDocuments } from '@/lib/types'

export function FolderSection({ folder }: { folder: FolderWithDocuments }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-brand-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-2.5 bg-brand-card hover:bg-brand-card/80 transition-colors text-left"
      >
        <div className="flex-shrink-0 w-7 h-7 bg-brand-gold/10 rounded flex items-center justify-center">
          <Folder size={14} className="text-brand-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-brand-text">{folder.name}</h3>
        </div>
        <span className="text-xs text-brand-muted mr-2">
          {folder.documents.length} {folder.documents.length === 1 ? 'document' : 'documents'}
        </span>
        {open ? (
          <ChevronDown size={16} className="text-brand-muted" />
        ) : (
          <ChevronRight size={16} className="text-brand-muted" />
        )}
      </button>
      {open && folder.documents.length > 0 && (
        <div className="px-2 py-2 space-y-0.5 bg-brand-darker">
          {folder.documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
      {open && folder.documents.length === 0 && (
        <div className="px-5 py-6 text-center text-sm text-brand-muted bg-brand-darker">
          No documents uploaded yet
        </div>
      )}
    </div>
  )
}
