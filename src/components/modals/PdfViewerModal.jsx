import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { X, Download, ExternalLink } from 'lucide-react'

export default function PdfViewerModal({ pdfUrl, title, onClose }) {
  const overlayRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
    gsap.fromTo(modalRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' })
  }, [])

  const handleClose = () => {
    gsap.to(modalRef.current, { scale: 0.9, opacity: 0, duration: 0.2, ease: 'power3.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div ref={overlayRef} onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div ref={modalRef}
        className="relative z-10 bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col"
        style={{ boxShadow: '0 20px 60px rgba(10,45,83,0.3)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 flex-shrink-0"
          style={{ borderColor: 'var(--color-stroke)' }}>
          <div>
            <h3 className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>
              {title || 'PDF Document'}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-body-color)' }}>
              Click and drag to scroll
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a href={pdfUrl} download
              className="rounded-xl px-4 py-2 text-xs font-bold text-white transition-all hover:scale-105"
              style={{ background: 'var(--color-secondary)' }}
              title="Download PDF">
              <Download className="h-3.5 w-3.5 inline mr-1.5" />
              Download
            </a>
            <a href={pdfUrl} target="_blank" rel="noreferrer"
              className="rounded-xl border px-4 py-2 text-xs font-semibold transition-colors"
              style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title="Open in new tab">
              <ExternalLink className="h-3.5 w-3.5 inline mr-1.5" />
              New Tab
            </a>
            <button onClick={handleClose}
              className="rounded-xl p-2 transition-colors hover:bg-[var(--color-gray-1)]"
              style={{ color: 'var(--color-body-color)' }}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden" style={{ background: 'var(--color-gray-1)' }}>
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title={title || 'PDF Document'}
            style={{ border: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}
