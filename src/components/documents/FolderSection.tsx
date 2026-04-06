'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Folder } from 'lucide-react'
import { DocumentCard } from './DocumentCard'
import type { FolderWithDocuments } from '@/lib/types'

export function FolderSection({ folder }: { folder: FolderWithDocuments }) {
  const [open, setOpen] = useState(!folder.is_collapsed_default)

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-brand-card hover:bg-brand-card/80 transition-colors text-left"
      >
        <div className="flex-shrink-0 w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center">
          <Folder size={16} className="text-brand-gold" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-brand-text">{folder.name}</h3>
          {folder.description && (
            <p className="text-xs text-brand-muted mt-0.5">{folder.description}</p>
          )}
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
