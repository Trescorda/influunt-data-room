'use client'

import Link from 'next/link'
import { FileText, Download, Eye, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Document } from '@/lib/types'

function formatFileSize(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DocumentCard({ doc }: { doc: Document }) {
  return (
    <Link
      href={`/room/documents/${doc.id}`}
      className="flex items-center gap-4 px-4 py-3 rounded-inf border border-transparent hover:bg-inf-green/[0.03] hover:border-inf-line hover:translate-x-0.5 transition-all duration-200 group"
    >
      <div className="flex-shrink-0 w-10 h-10 bg-inf-gold/10 rounded-inf flex items-center justify-center transition-colors group-hover:bg-inf-gold/15">
        <FileText size={18} className="text-inf-gold" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-inf-green group-hover:text-inf-gold-deep transition-colors truncate">
          {doc.title}
        </p>
        {doc.description && (
          <p className="text-xs text-inf-muted mt-0.5 truncate">{doc.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {doc.file_size && (
          <span className="text-xs text-inf-muted" data-numeric>{formatFileSize(doc.file_size)}</span>
        )}
        <Badge variant={doc.file_type === 'pdf' ? 'gold' : 'gray'}>
          {doc.file_type.toUpperCase()}
        </Badge>
        {doc.is_watermarked && <Lock size={12} className="text-inf-muted" />}
      </div>
    </Link>
  )
}
