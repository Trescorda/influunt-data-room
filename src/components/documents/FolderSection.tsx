'use client'

import { useState } from 'react'
import {
  ChevronDown, Folder, Briefcase, Scale, Shield,
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
        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-white/[0.03] transition-colors text-left"
      >
        <Folder size={13} className="text-brand-muted flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-brand-text">{folder.name}</h4>
          {folder.description && (
            <p className="text-[11px] text-brand-muted mt-0.5 truncate">{folder.description}</p>
          )}
        </div>
        <span className="text-[11px] text-brand-muted mr-1" data-numeric>
          {docCount} {docCount === 1 ? 'doc' : 'docs'}
        </span>
        <ChevronDown
          size={13}
          className={`text-brand-muted transition-transform duration-300 ${open ? 'rotate-0' : '-rotate-90'}`}
        />
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
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${open ? 'border-brand-gold/25 shadow-[0_4px_24px_rgba(0,0,0,0.25)]' : 'border-brand-border hover:border-brand-border-strong'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="group w-full flex items-center gap-4 px-5 py-5 bg-brand-card hover:bg-brand-card-hover transition-colors text-left"
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${open ? 'bg-brand-gold/15 shadow-[0_0_16px_rgba(200,168,92,0.15)]' : 'bg-brand-gold/10 group-hover:bg-brand-gold/15'}`}>
          <FolderIcon size={20} className="text-brand-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-brand-text">{folder.name}</h3>
          {folder.description && (
            <p className="text-sm text-brand-muted mt-0.5 truncate">{folder.description}</p>
          )}
        </div>
        <span className="text-sm text-brand-muted mr-2" data-numeric>
          {totalDocs} {totalDocs === 1 ? 'document' : 'documents'}
        </span>
        <ChevronDown
          size={16}
          className={`text-brand-muted transition-transform duration-300 ${open ? 'rotate-0' : '-rotate-90'}`}
        />
      </button>
      {open && (
        <div className="bg-brand-darker">
          {hasSubfolders ? (
            <>
              {/* Subfolders */}
              <div className="py-1">
                {(folder.subfolders || []).map((sf) => (
                  <SubfolderSection key={sf.id} folder={sf} />
                ))}
              </div>
              {/* Documents assigned directly to parent → show as "Uncategorised" */}
              {directDocCount > 0 && (
                <div className="ml-5 border-l-2 border-brand-border/40">
                  <div className="flex items-center gap-2.5 px-4 py-2">
                    <Folder size={13} className="text-brand-muted" />
                    <h4 className="text-xs font-semibold text-brand-muted">Uncategorised</h4>
                  </div>
                  <div className="ml-4 px-2 py-1 space-y-0.5">
                    {folder.documents.map((doc) => (
                      <DocumentCard key={doc.id} doc={doc} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* No subfolders — show documents directly */}
              {directDocCount > 0 && (
                <div className="px-2 py-2 space-y-0.5">
                  {folder.documents.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
              )}
              {directDocCount === 0 && (
                <div className="px-5 py-4 text-center text-xs text-brand-muted italic">
                  No documents uploaded yet
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
