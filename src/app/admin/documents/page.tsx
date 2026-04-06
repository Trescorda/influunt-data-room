'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Upload, FileText, Eye, Download, Lock, Folder } from 'lucide-react'
import type { Document, DocumentFolder, FolderWithDocuments } from '@/lib/types'

export default function DocumentsPage() {
  const [folders, setFolders] = useState<FolderWithDocuments[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploadFolderId, setUploadFolderId] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const loadDocuments = async () => {
    const { data: foldersData } = await supabase
      .from('document_folders')
      .select('*')
      .order('sort_order')

    const { data: docsData } = await supabase
      .from('documents')
      .select('*')
      .order('sort_order')

    const result: FolderWithDocuments[] = (foldersData || []).map((folder) => ({
      ...folder,
      documents: (docsData || []).filter((doc) => doc.folder_id === folder.id),
    }))

    setFolders(result)
    if (result.length > 0 && !uploadFolderId) {
      setUploadFolderId(result[0].id)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !uploadTitle || !uploadFolderId) return

    setUploading(true)

    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || 'bin'
    const filePath = `${uploadFolderId}/${Date.now()}-${selectedFile.name}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, selectedFile)

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { error: insertError } = await supabase.from('documents').insert({
      folder_id: uploadFolderId,
      title: uploadTitle,
      description: uploadDescription || null,
      file_path: filePath,
      file_type: fileExt,
      file_size: selectedFile.size,
    })

    if (insertError) {
      alert('Failed to save document: ' + insertError.message)
      setUploading(false)
      return
    }

    setUploadTitle('')
    setUploadDescription('')
    setSelectedFile(null)
    setShowUpload(false)
    setUploading(false)
    loadDocuments()
  }

  const toggleDocProp = async (docId: string, prop: 'is_viewable' | 'is_downloadable' | 'is_watermarked', value: boolean) => {
    await supabase.from('documents').update({ [prop]: value }).eq('id', docId)
    loadDocuments()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-brand-text">Documents</h1>
          <p className="text-sm text-brand-muted mt-1">Upload and manage data room documents</p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Upload size={16} className="mr-2" />
          Upload document
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-brand-muted text-sm">Loading...</div>
      ) : (
        <div className="space-y-4">
          {folders.map((folder) => (
            <Card key={folder.id} padding="sm">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-border">
                <Folder size={16} className="text-brand-gold" />
                <h3 className="text-sm font-semibold text-brand-text">{folder.name}</h3>
                <Badge variant="gray">{folder.documents.length}</Badge>
              </div>
              {folder.documents.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-brand-muted">
                  No documents in this folder
                </div>
              ) : (
                <div className="divide-y divide-brand-border">
                  {folder.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-4 px-4 py-3">
                      <FileText size={16} className="text-brand-gold flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-text truncate">{doc.title}</p>
                        <p className="text-xs text-brand-muted">
                          {doc.file_type.toUpperCase()} &middot;{' '}
                          {doc.file_size ? `${(doc.file_size / (1024 * 1024)).toFixed(1)} MB` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload document">
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            label="Document title"
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            placeholder="e.g. Executive Summary"
            required
          />
          <Input
            label="Description (optional)"
            value={uploadDescription}
            onChange={(e) => setUploadDescription(e.target.value)}
            placeholder="Brief description"
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-brand-text">Folder</label>
            <select
              value={uploadFolderId}
              onChange={(e) => setUploadFolderId(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-brand-text">File</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-gold/10 file:text-brand-gold hover:file:bg-brand-gold/20"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowUpload(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={uploading} className="flex-1">
              Upload
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
