'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Watermark } from './Watermark'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface DocumentViewerProps {
  docId: string
  fileType: string
  isDownloadable: boolean
  isWatermarked: boolean
  investorName: string
  investorEmail: string
  watermarkOpacity: number
}

export function DocumentViewer({
  docId,
  fileType,
  isDownloadable,
  isWatermarked,
  investorName,
  investorEmail,
  watermarkOpacity,
}: DocumentViewerProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const activityIdRef = useRef<string | null>(null)
  const startTimeRef = useRef(Date.now())

  // Fetch signed URL
  useEffect(() => {
    async function fetchUrl() {
      const res = await fetch(`/api/documents?id=${docId}`)
      const data = await res.json()
      if (data.url) {
        setSignedUrl(data.url)
      } else {
        setError(data.error || 'Failed to load document')
      }
      setLoading(false)
    }
    fetchUrl()
  }, [docId])

  // Track activity
  useEffect(() => {
    async function logView() {
      const res = await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'view_document', document_id: docId }),
      })
      const data = await res.json()
      if (data.id) activityIdRef.current = data.id
    }
    logView()
    startTimeRef.current = Date.now()

    const updateDuration = () => {
      if (activityIdRef.current) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
        navigator.sendBeacon(
          '/api/activity',
          new Blob(
            [JSON.stringify({ id: activityIdRef.current, duration_seconds: duration })],
            { type: 'application/json' }
          )
        )
      }
    }

    window.addEventListener('beforeunload', updateDuration)
    return () => {
      updateDuration()
      window.removeEventListener('beforeunload', updateDuration)
    }
  }, [docId])

  // Disable right-click if not downloadable
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!isDownloadable) e.preventDefault()
    },
    [isDownloadable]
  )

  const handleDownload = async () => {
    if (!signedUrl || !isDownloadable) return
    await fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'download_document', document_id: docId }),
    })
    window.open(signedUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-brand-gold" size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  const isPdf = fileType === 'pdf'
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileType)
  const showBottomBar = isPdf && numPages > 1

  return (
    <div onContextMenu={handleContextMenu} className="flex flex-col h-full">
      {/* Download bar */}
      {isDownloadable && (
        <div className="flex justify-end px-4 py-2 flex-shrink-0">
          <Button onClick={handleDownload} variant="secondary" size="sm">
            <Download size={14} className="mr-2" />
            Download
          </Button>
        </div>
      )}

      {/* Scrollable document area */}
      <div className="relative flex-1 overflow-y-auto bg-brand-darker">
        {isWatermarked && (
          <Watermark
            name={investorName}
            email={investorEmail}
            opacity={watermarkOpacity}
          />
        )}

        {isPdf && signedUrl && (
          <div className="flex flex-col items-center py-4">
            <Document
              file={signedUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div className="flex items-center justify-center py-32">
                  <Loader2 className="animate-spin text-brand-gold" size={32} />
                </div>
              }
              error={
                <div className="text-center py-32">
                  <p className="text-red-400 text-sm">Failed to load PDF</p>
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                width={Math.min(850, typeof window !== 'undefined' ? window.innerWidth - 100 : 850)}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        )}

        {isImage && signedUrl && (
          <div className="flex justify-center p-6">
            <img
              src={signedUrl}
              alt="Document"
              className="max-w-full rounded"
              draggable={false}
            />
          </div>
        )}

        {!isPdf && !isImage && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-brand-muted text-sm">
                This document type ({fileType.toUpperCase()}) cannot be previewed in-browser.
              </p>
              {isDownloadable && (
                <Button onClick={handleDownload} className="mt-4" size="sm">
                  <Download size={14} className="mr-2" />
                  Download to view
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom page navigation */}
      {showBottomBar && (
        <div className="flex-shrink-0 flex items-center justify-center gap-6 px-4 py-2.5 bg-brand-dark border-t border-brand-border">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 text-sm text-brand-muted hover:text-brand-gold disabled:opacity-30 disabled:hover:text-brand-muted transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <span className="text-sm text-brand-muted">
            Page {currentPage} of {numPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
            className="flex items-center gap-1 text-sm text-brand-muted hover:text-brand-gold disabled:opacity-30 disabled:hover:text-brand-muted transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
