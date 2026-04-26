'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Upload, FileText, Eye, Download, Lock, Trash2, UploadCloud } from 'lucide-react'

interface Folder {
  id: string
  name: string
  parent_id: string | null
  sort_order: number
}

interface Document {
  id: string
  title: string
  description: string | null
  file_path: string
  file_type: string
  file_size: number | null
  folder_id: string
  is_viewable: boolean
  is_downloadable: boolean
  is_watermarked: boolean
  created_at: string
  document_folders?: { name: string; parent_id: string | null } | null
}

export default function DocumentsPage() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [filterFolderId, setFilterFolderId] = useState<string>('all')

  // Upload modal state
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploadFolderId, setUploadFolderId] = useState('')
  const [uploadViewable, setUploadViewable] = useState(true)
  const [uploadDownloadable, setUploadDownloadable] = useState(false)
  const [uploadWatermarked, setUploadWatermarked] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadDocuments = async () => {
    try {
      const res = await fetch('/api/admin/documents')
      const data = await res.json()
      console.log('[Admin Docs] Raw API response:', data)
      console.log('[Admin Docs] Folders:', data.folders?.length, 'Documents:', data.documents?.length)

      if (!res.ok) {
        console.error('[Admin Docs] API error:', data.error)
        setLoading(false)
        return
      }

      setFolders(data.folders || [])
      setDocuments(data.documents || [])

      // Set default upload folder to the first top-level folder
      // (Subcategories temporarily hidden from upload UI — only macro categories used)
      if ((data.folders || []).length > 0 && !uploadFolderId) {
        const allFolders: Folder[] = data.folders
        const topLevel = allFolders
          .filter((f) => !f.parent_id)
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        if (topLevel[0]) setUploadFolderId(topLevel[0].id)
      }
    } catch (err) {
      console.error('[Admin Docs] Fetch failed:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  // Build display path for a folder ("Parent > Child")
  const folderPath = (folderId: string | null | undefined): string => {
    if (!folderId) return '—'
    const folder = folders.find((f) => f.id === folderId)
    if (!folder) return 'Unknown'
    if (folder.parent_id) {
      const parent = folders.find((f) => f.id === folder.parent_id)
      if (parent) return `${parent.name} > ${folder.name}`
    }
    return folder.name
  }

  // Filtered documents based on selected category.
  // If the selected folder has subfolders (legacy structure), include documents
  // assigned to those subfolders too — so filtering by "Financials" surfaces
  // docs sitting in "Financials > Financial Model" etc.
  const filteredDocs = useMemo(() => {
    if (filterFolderId === 'all') return documents
    const childIds = folders.filter((f) => f.parent_id === filterFolderId).map((f) => f.id)
    const allowed = new Set([filterFolderId, ...childIds])
    return documents.filter((d) => allowed.has(d.folder_id))
  }, [documents, filterFolderId, folders])

  // Build folder options grouped by parent for the upload dropdown and filter
  const folderOptions = useMemo(() => {
    const topLevel = folders
      .filter((f) => !f.parent_id)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    return topLevel.map((parent) => {
      const children = folders
        .filter((f) => f.parent_id === parent.id)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      return { parent, children }
    })
  }, [folders])

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
    // Optimistic update
    setDocuments((docs) => docs.map((d) => d.id === docId ? { ...d, [prop]: value } : d))
    await fetch('/api/admin/documents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: docId, [prop]: value }),
    })
  }

  function formatSize(bytes: number | null): string {
    if (!bytes) return '—'
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="px-4 md:px-8 py-4 md:py-6">
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

      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs text-brand-muted">Filter:</label>
        <select
          value={filterFolderId}
          onChange={(e) => setFilterFolderId(e.target.value)}
          className="text-sm min-w-[220px]"
        >
          <option value="all">All categories</option>
          {folderOptions.map(({ parent }) => (
            <option key={parent.id} value={parent.id}>{parent.name}</option>
          ))}
        </select>
        <span className="text-xs text-brand-muted ml-auto">
          {filteredDocs.length} {filteredDocs.length === 1 ? 'document' : 'documents'}
        </span>
      </div>

      {/* Flat table */}
      <Card padding="sm">
        {loading ? (
          <div className="py-12 text-center text-brand-muted text-sm">Loading...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-12 text-center text-brand-muted text-sm">
            No documents {filterFolderId !== 'all' ? 'in this folder' : 'uploaded yet'}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Folder</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Size</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Uploaded</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="border-b border-brand-border hover:bg-brand-card/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-brand-gold flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-brand-text truncate">{doc.title}</p>
                          {doc.description && (
                            <p className="text-xs text-brand-muted truncate">{doc.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-brand-muted">
                      {folderPath(doc.folder_id)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-brand-gold uppercase">{doc.file_type}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-brand-muted">{formatSize(doc.file_size)}</td>
                    <td className="px-4 py-3 text-xs text-brand-muted">{formatDate(doc.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleDocProp(doc.id, 'is_viewable', !doc.is_viewable)}
                          className={`p-1.5 rounded transition-colors ${doc.is_viewable ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted hover:text-brand-text'}`}
                          title={doc.is_viewable ? 'Viewable (click to hide)' : 'Hidden (click to show)'}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => toggleDocProp(doc.id, 'is_downloadable', !doc.is_downloadable)}
                          className={`p-1.5 rounded transition-colors ${doc.is_downloadable ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted hover:text-brand-text'}`}
                          title={doc.is_downloadable ? 'Downloadable (click to disable)' : 'View only (click to allow downloads)'}
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => toggleDocProp(doc.id, 'is_watermarked', !doc.is_watermarked)}
                          className={`p-1.5 rounded transition-colors ${doc.is_watermarked ? 'text-brand-gold bg-brand-gold/10' : 'text-brand-muted hover:text-brand-text'}`}
                          title={doc.is_watermarked ? 'Watermarked (click to remove)' : 'No watermark (click to add)'}
                        >
                          <Lock size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(doc.id)}
                          className="p-1.5 rounded text-[#666] hover:text-red-500 transition-colors"
                          title="Delete document"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Upload modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload document">
        <form onSubmit={handleUpload} className="space-y-4">
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
            <label className="block text-sm font-medium text-brand-text">Category</label>
            <select
              value={uploadFolderId}
              onChange={(e) => setUploadFolderId(e.target.value)}
              className="w-full text-sm"
            >
              {folderOptions.map(({ parent }) => (
                <option key={parent.id} value={parent.id}>{parent.name}</option>
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
