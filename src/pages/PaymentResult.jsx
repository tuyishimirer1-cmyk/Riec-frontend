import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CheckCircle2, CircleX, Download, Loader2 } from 'lucide-react'
import { useGetDownloads, useGetProjectAssetDownloadUrl } from '../react-query'

export default function PaymentResult() {
  const [searchParams] = useSearchParams()
  const txRef = searchParams.get('tx_ref')
  const status = (searchParams.get('status') || '').toLowerCase()
  const tokenFromUrl = searchParams.get('token') || ''

  const [tokenInput, setTokenInput] = useState(tokenFromUrl)
  const [submittedToken, setSubmittedToken] = useState(tokenFromUrl)

  // Auto-load downloads when token is in URL
  useEffect(() => {
    if (tokenFromUrl && tokenFromUrl.trim()) {
      setSubmittedToken(tokenFromUrl.trim())
    }
  }, [tokenFromUrl])

  const { data: downloadsData, isFetching, error } = useGetDownloads(submittedToken)
  const fetchDownloadUrlMutation = useGetProjectAssetDownloadUrl()

  const isSuccess = status === 'successful' || status === 'completed' || status === 'success'
  const isFailed = status === 'failed' || status === 'cancelled'

  const assets = useMemo(() => {
    if (Array.isArray(downloadsData?.data)) return downloadsData.data
    if (Array.isArray(downloadsData?.assets)) return downloadsData.assets
    if (Array.isArray(downloadsData)) return downloadsData
    return []
  }, [downloadsData])

  const projectIdFromPurchase = downloadsData?.purchase?.project?.id

  const handleDownload = async (asset) => {
    const directUrl = asset?.downloadUrl || asset?.url
    const filename = asset?.filename || 'download'
    
    if (directUrl) {
      // Open in new tab for preview
      window.open(directUrl, '_blank', 'noopener,noreferrer')
      
      // Also trigger automatic download to PC
      try {
        const response = await fetch(directUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (err) {
        console.error('Auto-download failed:', err)
        // Preview still works even if auto-download fails
      }
      return
    }

    const projectId = asset?.projectId || projectIdFromPurchase
    if (!projectId || !asset?.id) return

    try {
      const result = await fetchDownloadUrlMutation.mutateAsync({ projectId, assetId: asset.id })
      const url = result?.data?.downloadUrl || result?.downloadUrl || result?.data?.url || result?.url
      
      if (url) {
        // Open in new tab for preview
        window.open(url, '_blank', 'noopener,noreferrer')
        
        // Also trigger automatic download to PC
        try {
          const response = await fetch(url)
          const blob = await response.blob()
          const blobUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(blobUrl)
        } catch (err) {
          console.error('Auto-download failed:', err)
          // Preview still works even if auto-download fails
        }
      }
    } catch (err) {
      console.error('Download error:', err)
      alert('Failed to generate download link. Please try again.')
    }
  }

  return (
    <>
      <Helmet>
        <title>Payment Result | R.I.E.C</title>
      </Helmet>

      <main className="min-h-screen bg-riec-dark pb-16 pt-28 text-slate-100">
        <div className="mx-auto max-w-3xl px-4">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
            <div className="mb-5 flex items-center gap-3">
              {isSuccess ? (
                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              ) : isFailed ? (
                <CircleX className="h-7 w-7 text-red-400" />
              ) : (
                <Loader2 className="h-7 w-7 animate-spin text-riec-orange" />
              )}

              <div>
                <h1 className="text-2xl font-bold text-white">Payment status</h1>
                <p className="text-xs text-slate-400">
                  {status || 'pending'}{txRef ? ` · ${txRef}` : ''}
                </p>
              </div>
            </div>

            {isSuccess && (
              <p className="mb-4 rounded-xl border border-emerald-700/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                🎉 Payment successful! Check your email for your purchased project PDF and download token.
                Your project files are also available below for immediate download.
              </p>
            )}

            {isFailed && (
              <p className="mb-4 rounded-xl border border-red-700/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                Payment was not completed. You can return to the project page and try checkout again.
              </p>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste download token"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSubmittedToken(tokenInput.trim())}
                disabled={!tokenInput.trim() || isFetching}
                className="rounded-full bg-riec-orange px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-riec-orange-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFetching ? 'Checking...' : 'Load downloads'}
              </button>
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-red-700/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                Invalid or expired token.
              </p>
            )}
          </section>

          {assets.length > 0 && (
            <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.4)]">
              <h2 className="mb-4 text-lg font-bold text-white">Your downloads</h2>

              <div className="space-y-3">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-100">{asset.filename || asset.documentType || 'Asset'}</p>
                      <p className="text-xs text-slate-400">{asset.documentType || 'Document'}{asset.version ? ` · ${asset.version}` : ''}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownload(asset)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-riec-orange/40 px-4 py-2 text-xs font-semibold text-riec-orange transition-colors hover:bg-riec-orange/10"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-6 flex items-center gap-3">
            <Link to="/projects" className="text-sm font-semibold text-riec-orange hover:underline">Browse projects</Link>
            <span className="text-slate-600">•</span>
            <Link to="/" className="text-sm font-semibold text-slate-300 hover:text-white">Back home</Link>
          </div>
        </div>
      </main>
    </>
  )
}
