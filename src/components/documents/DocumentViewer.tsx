'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { PageWatermark } from './Watermark'
import { Button } from '@/components/ui/Button'
import { Download, Loader2 } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface DocumentViewerProps {
  docId: string
  fileType: string
  isDownloadable: boolean
  isWatermarked: boolean
  watermarkOpacity?: number
}

export function DocumentViewer({
  docId,
  fileType,
  isDownloadable,
  isWatermarked,
  watermarkOpacity = 6,
}: DocumentViewerProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const activityIdRef = useRef<string | null>(null)
  const startTimeRef = useRef(Date.now())
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])

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

  // Track scroll position to update current page
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || numPages === 0) return

    const handleScroll = () => {
      const containerTop = container.scrollTop
      const containerHeight = container.clientHeight
      const scrollCenter = containerTop + containerHeight / 3

      for (let i = pageRefs.current.length - 1; i >= 0; i--) {
        const el = pageRefs.current[i]
        if (el && el.offsetTop <= scrollCenter) {
          setCurrentPage(i + 1)
          break
        }
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [numPages])

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
      <div ref={scrollContainerRef} className="relative flex-1 overflow-y-auto bg-brand-darker">
        {isPdf && signedUrl && (
          <div className="flex flex-col items-center py-4">
            <Document
              file={signedUrl}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages)
                pageRefs.current = new Array(numPages).fill(null)
              }}
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
              {Array.from({ length: numPages }, (_, i) => (
                <div
                  key={i}
                  ref={(el) => { pageRefs.current[i] = el }}
                  className="relative mb-3"
                >
                  <Page
                    pageNumber={i + 1}
                    width={Math.min(850, typeof window !== 'undefined' ? window.innerWidth - 100 : 850)}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                  {isWatermarked && <PageWatermark opacity={watermarkOpacity} />}
                  {i < numPages - 1 && (
                    <div className="border-b border-brand-border/30 mt-3" />
                  )}
                </div>
              ))}
            </Document>
          </div>
        )}

        {isImage && signedUrl && (
          <div className="relative flex justify-center p-6">
            <img
              src={signedUrl}
              alt="Document"
              className="max-w-full rounded"
              draggable={false}
            />
            {isWatermarked && <PageWatermark opacity={watermarkOpacity} />}
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

        {/* Floating page counter */}
        {isPdf && numPages > 1 && (
          <div className="sticky bottom-3 flex justify-end pr-4 pointer-events-none z-20">
            <span className="pointer-events-auto bg-brand-dark/90 border border-brand-border text-xs text-brand-muted px-3 py-1.5 rounded-lg">
              Page {currentPage} of {numPages}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
