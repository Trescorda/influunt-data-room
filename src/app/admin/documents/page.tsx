'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Upload, FileText, Eye, Download, Lock, Folder, Trash2, UploadCloud } from 'lucide-react'
import type { DocumentFolder, FolderWithDocuments } from '@/lib/types'

export default function DocumentsPage() {
  const [folders, setFolders] = useState<FolderWithDocuments[]>([])
  const [allFlatFolders, setAllFlatFolders] = useState<DocumentFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploadFolderId, setUploadFolderId] = useState('')
  const [uploadViewable, setUploadViewable] = useState(true)
  const [uploadDownloadable, setUploadDownloadable] = useState(false)
  const [uploadWatermarked, setUploadWatermarked] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const loadDocuments = async () => {
    const res = await fetch('/api/admin/documents')
    const data = await res.json()
    const allFolders = data.folders || []
    const allDocs = data.documents || []

    // Build tree: top-level folders with subfolders
    const topLevel = allFolders
      .filter((f: any) => !f.parent_id)
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((folder: any) => ({
        ...folder,
        documents: allDocs.filter((d: any) => d.folder_id === folder.id),
        subfolders: allFolders
          .filter((sf: any) => sf.parent_id === folder.id)
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((sf: any) => ({
            ...sf,
            documents: allDocs.filter((d: any) => d.folder_id === sf.id),
          })),
      }))

    setFolders(topLevel)
    setAllFlatFolders(allFolders)
    if (allFolders.length > 0 && !uploadFolderId) {
      setUploadFolderId(allFolders[0].id)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    if (!uploadTitle) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [uploadTitle])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !uploadTitle || !uploadFolderId) return

    setUploading(true)

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('title', uploadTitle)
    formData.append('description', uploadDescription)
    formData.append('folder_id', uploadFolderId)
    formData.append('is_viewable', String(uploadViewable))
    formData.append('is_downloadable', String(uploadDownloadable))
    formData.append('is_watermarked', String(uploadWatermarked))

    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    const result = await res.json()

    if (!res.ok) {
      alert(result.error || 'Upload failed')
      setUploading(false)
      return
    }

    resetUploadForm()
    setShowUpload(false)
    setUploading(false)
    loadDocuments()
  }

  const resetUploadForm = () => {
    setUploadTitle('')
    setUploadDescription('')
    setSelectedFile(null)
    setUploadViewable(true)
    setUploadDownloadable(false)
    setUploadWatermarked(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    await fetch(`/api/documents?id=${deleteId}`, { method: 'DELETE' })

    setDeleteId(null)
    setDeleting(false)
    loadDocuments()
  }

  const toggleDocProp = async (docId: string, prop: 'is_viewable' | 'is_downloadable' | 'is_watermarked', value: boolean) => {
    await fetch('/api/admin/documents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: docId, [prop]: value }),
    })
    loadDocuments()
  }

  function formatSize(bytes: number | null): string {
    if (!bytes) return '—'
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-brand-text">Documents</h1>
          <p className="text-sm text-brand-muted mt-1">Upload and manage data room documents</p>
        </div>
        <Button onClick={() => { resetUploadForm(); setShowUpload(true) }}>
          <Upload size={16} className="mr-2" />
          Upload document
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-brand-muted text-sm">Loading...</div>
      ) : (
        <div className="space-y-4">
          {folders.map((folder) => {
            const allDocs = [...folder.documents, ...(folder.subfolders || []).flatMap((sf) => sf.documents)]
            return (
            <Card key={folder.id} padding="sm">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-border">
                <Folder size={16} className="text-brand-gold" />
                <h3 className="text-sm font-semibold text-brand-text">{folder.name}</h3>
                <Badge variant="gray">{allDocs.length}</Badge>
              </div>

              {/* Direct documents */}
              {folder.documents.length > 0 && (
                <div className="divide-y divide-brand-border">
                  {folder.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-4 px-4 py-3">
                      <FileText size={16} className="text-brand-gold flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-text truncate">{doc.title}</p>
                        <p className="text-xs text-brand-muted">
                          {doc.file_type.toUpperCase()} &middot; {formatSize(doc.file_size)} &middot; {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleDocProp(doc.id, 'is_viewable', !doc.is_viewable)}
                          className={`p-1.5 rounded transition-colors ${doc.is_viewable ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted hover:text-brand-text'}`}
                          title="Viewable"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => toggleDocProp(doc.id, 'is_downloadable', !doc.is_downloadable)}
                          className={`p-1.5 rounded transition-colors ${doc.is_downloadable ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted hover:text-brand-text'}`}
                          title="Downloadable"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => toggleDocProp(doc.id, 'is_watermarked', !doc.is_watermarked)}
                          className={`p-1.5 rounded transition-colors ${doc.is_watermarked ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted hover:text-brand-text'}`}
                          title="Watermarked"
                        >
                          <Lock size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(doc.id)}
                          className="p-1.5 rounded text-brand-muted hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Subfolders */}
              {(folder.subfolders || []).map((sf) => (
                <div key={sf.id}>
                  <div className="flex items-center gap-2 px-4 py-2 bg-brand-dark/30 border-t border-brand-border">
                    <Folder size={13} className="text-brand-muted" />
                    <span className="text-xs font-semibold text-brand-muted">{sf.name}</span>
                    <Badge variant="gray">{sf.documents.length}</Badge>
                  </div>
                  {sf.documents.length > 0 ? (
                    <div className="divide-y divide-brand-border">
                      {sf.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-4 px-4 py-3 pl-8">
                          <FileText size={16} className="text-brand-gold flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-brand-text truncate">{doc.title}</p>
                            <p className="text-xs text-brand-muted">
                              {doc.file_type.toUpperCase()} &middot; {formatSize(doc.file_size)} &middot; {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => toggleDocProp(doc.id, 'is_viewable', !doc.is_viewable)} className={`p-1.5 rounded transition-colors ${doc.is_viewable ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted hover:text-brand-text'}`} title="Viewable"><Eye size={14} /></button>
                            <button onClick={() => toggleDocProp(doc.id, 'is_downloadable', !doc.is_downloadable)} className={`p-1.5 rounded transition-colors ${doc.is_downloadable ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted hover:text-brand-text'}`} title="Downloadable"><Download size={14} /></button>
                            <button onClick={() => toggleDocProp(doc.id, 'is_watermarked', !doc.is_watermarked)} className={`p-1.5 rounded transition-colors ${doc.is_watermarked ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted hover:text-brand-text'}`} title="Watermarked"><Lock size={14} /></button>
                            <button onClick={() => setDeleteId(doc.id)} className="p-1.5 rounded text-brand-muted hover:text-red-400 transition-colors" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-8 py-3 text-xs text-brand-muted italic">No documents</div>
                  )}
                </div>
              ))}

              {/* Empty state for folders with no docs and no subfolders */}
              {allDocs.length === 0 && (folder.subfolders || []).length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-brand-muted">
                  No documents in this folder
                </div>
              )}
            </Card>
          )})}
        </div>
      )}

      {/* Upload modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload document">
        <form onSubmit={handleUpload} className="space-y-4">
          {/* Drag and drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-border hover:border-brand-gold/50'
            }`}
          >
            <UploadCloud size={24} className="mx-auto text-brand-muted mb-2" />
            {selectedFile ? (
              <p className="text-sm text-brand-gold">{selectedFile.name} ({formatSize(selectedFile.size)})</p>
            ) : (
              <>
                <p className="text-sm text-brand-muted">Drag and drop a file here, or click to browse</p>
                <p className="text-xs text-brand-muted mt-1">PDF, DOCX, XLSX, PPTX, PNG, JPG</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]) }}
              className="hidden"
            />
          </div>
          <Input
            label="Document title"
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            placeholder="e.g. Executive Summary"
            required
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-brand-text">Description (optional)</label>
            <textarea
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              placeholder="Brief description"
              className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/50 resize-none"
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-brand-text">Folder</label>
            <select
              value={uploadFolderId}
              onChange={(e) => setUploadFolderId(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
            >
              {folders.map((f) => (
                <optgroup key={f.id} label={f.name}>
                  <option value={f.id}>{f.name} (root)</option>
                  {(f.subfolders || []).map((sf) => (
                    <option key={sf.id} value={sf.id}>&nbsp;&nbsp;{sf.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={uploadViewable} onChange={(e) => setUploadViewable(e.target.checked)} className="w-4 h-4 accent-brand-gold" />
              <span className="text-sm text-brand-text">Viewable</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={uploadDownloadable} onChange={(e) => setUploadDownloadable(e.target.checked)} className="w-4 h-4 accent-brand-gold" />
              <span className="text-sm text-brand-text">Downloadable</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={uploadWatermarked} onChange={(e) => setUploadWatermarked(e.target.checked)} className="w-4 h-4 accent-brand-gold" />
              <span className="text-sm text-brand-text">Watermarked</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowUpload(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={uploading} disabled={!selectedFile} className="flex-1">
              Upload
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete document">
        <p className="text-sm text-brand-muted mb-4">
          Are you sure you want to delete this document? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete} className="flex-1">
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
