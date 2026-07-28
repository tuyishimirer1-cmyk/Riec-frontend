import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, FileText, Image as ImageIcon, Archive, File, Download, Pencil, Trash2, Eye, EyeOff, Check, X } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useXhrUpload } from '../../../../hooks/useXhrUpload'
import { useGetProjectAssets, useUpdateProjectAsset, useDeleteProjectAsset, useGetProjectAssetDownloadUrl } from '../../../../react-query'
import { DOCUMENT_TYPES, selectCls } from '../constants'

/* ── Helpers ── */
function formatBytes(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function docTypeLabel(type = '') {
  return type.replace(/_/g, ' ')
}

function MimeIcon({ fileType = '' }) {
  const cls = 'h-3.5 w-3.5 flex-shrink-0'
  if (fileType.includes('pdf'))     return <FileText className={cls} style={{ color: 'var(--color-riec-orange)' }} />
  if (fileType.startsWith('image')) return <ImageIcon className={cls} style={{ color: 'var(--color-my-blue)' }} />
  if (fileType.includes('zip'))     return <Archive className={cls} style={{ color: 'var(--color-body-color)' }} />
  return <File className={cls} style={{ color: 'var(--color-body-color)' }} />
}

function docTypeBadgeStyle(type = '') {
  if (type.includes('DRAWING'))  return { background: 'rgba(30,154,224,0.12)',  color: 'var(--color-my-blue)' }
  if (type.includes('REPORT') || type.includes('SURVEY')) return { background: 'rgba(19,194,150,0.12)', color: 'var(--color-secondary)' }
  if (type.includes('PERMIT') || type.includes('TITLE') || type.includes('CONTRACT')) return { background: 'rgba(225,27,37,0.10)', color: 'var(--color-riec-red)' }
  return { background: 'rgba(238,122,24,0.12)', color: 'var(--color-riec-orange)' }
}

export default function AssetsPanel({ projectId }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { data, isLoading } = useGetProjectAssets({ projectId })
  const assets = data?.items ?? []

  const { upload, progress, uploading, error: uploadError } = useXhrUpload()
  const updateAssetMutation = useUpdateProjectAsset()
  const deleteAssetMutation = useDeleteProjectAsset()
  const fetchDownloadUrlMutation = useGetProjectAssetDownloadUrl()

  const [uploadDocType, setUploadDocType] = useState('PRESENTATION')
  const [editingId,     setEditingId]     = useState(null)
  const [editDraft,     setEditDraft]     = useState({ version: '', documentType: '', isDownloadable: false })
  const [editError,     setEditError]     = useState(null)

  /* ── Upload ── */
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const fd = new FormData()
    files.forEach((f) => fd.append('files', f))
    fd.append('documentType', uploadDocType)
    try {
      await upload(`/projects/${projectId}/assets`, fd)
      await queryClient.invalidateQueries({ queryKey: ['project-assets', projectId] })
    } catch { /* error shown via uploadError */ }
    e.target.value = ''
  }

  /* ── Download ── */
  const handleDownload = async (assetId) => {
    try {
      const result = await fetchDownloadUrlMutation.mutateAsync({ projectId, assetId })
      if (result?.downloadUrl) window.open(result.downloadUrl, '_blank')
    } catch { /* silently fail */ }
  }

  /* ── Edit ── */
  const startEdit = (asset) => {
    setEditingId(asset.id)
    setEditDraft({ version: asset.version || '', documentType: asset.documentType || '', isDownloadable: !!asset.isDownloadable })
    setEditError(null)
  }

  const saveEdit = async (assetId) => {
    setEditError(null)
    try {
      const updateBody = { version: editDraft.version, isDownloadable: editDraft.isDownloadable }
      await updateAssetMutation.mutateAsync({ projectId, assetId, ...updateBody })
      setEditingId(null)
    } catch (err) {
      setEditError(err?.data?.message || t('dash.manage.error_generic', { defaultValue: 'Something went wrong' }))
    }
  }

  /* ── Delete ── */
  const handleDelete = async (assetId) => {
    if (!window.confirm(t('dash.manage.confirm_delete_asset', { defaultValue: 'Delete this asset?' }))) return
    await deleteAssetMutation.mutateAsync({ projectId, assetId })
  }

  /* ── Toggle downloadable ── */
  const toggleDownloadable = async (asset) => {
    await updateAssetMutation.mutateAsync({ projectId, assetId: asset.id, isDownloadable: !asset.isDownloadable })
  }

  const updating = updateAssetMutation.isPending
  const deleting = deleteAssetMutation.isPending

  return (
    <div className="space-y-4">

      {/* Upload zone */}
      <div className="rounded-xl border-2 border-dashed p-4 space-y-3 transition-colors"
        style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-semibold" style={{ color: 'var(--color-body-color)' }}>
              {t('dash.manage.doc_type', { defaultValue: 'Document Category' })}
            </label>
            <select value={uploadDocType} onChange={(e) => setUploadDocType(e.target.value)}
              className={selectCls}>
              {DOCUMENT_TYPES.map((dt) => (
                <option key={dt} value={dt}>{docTypeLabel(dt)}</option>
              ))}
            </select>
          </div>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border px-5 py-3 transition-colors flex-shrink-0"
            style={{ borderColor: 'var(--color-riec-orange)', background: 'rgba(238,122,24,0.06)', color: 'var(--color-riec-orange)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(238,122,24,0.12)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(238,122,24,0.06)'}
          >
            <Upload className="h-4 w-4" />
            <span className="text-[10px] font-bold">
              {uploading
                ? `${progress}%`
                : t('dash.manage.upload_assets', { defaultValue: 'Upload Files' })}
            </span>
            <input type="file" multiple className="sr-only" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
        {uploading && (
          <div className="rounded-full overflow-hidden h-1.5" style={{ background: 'var(--color-gray-2)' }}>
            <div className="h-full rounded-full transition-all duration-200"
              style={{ width: `${progress}%`, background: 'var(--color-riec-orange)' }} />
          </div>
        )}
        {uploadError && <p className="text-[10px]" style={{ color: 'var(--color-riec-red)' }}>{uploadError}</p>}
      </div>

      {/* Table */}
      {isLoading && (
        <p className="text-xs text-center py-6" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.loading', { defaultValue: 'Loading…' })}
        </p>
      )}

      {!isLoading && assets.length === 0 && (
        <p className="text-xs text-center py-6" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.manage.no_assets', { defaultValue: 'No assets yet.' })}
        </p>
      )}

      {assets.length > 0 && (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-1)' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="border-b" style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}>
                <tr>
                  {[
                    t('dash.manage.col_file',         { defaultValue: 'File' }),
                    t('dash.manage.col_category',     { defaultValue: 'Category' }),
                    t('dash.manage.col_size',         { defaultValue: 'Size' }),
                    t('dash.manage.col_version',      { defaultValue: 'Version' }),
                    t('dash.manage.col_downloadable', { defaultValue: 'Downloadable' }),
                    t('dash.manage.col_actions',      { defaultValue: 'Actions' }),
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: 'var(--color-body-color)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <>
                    <tr key={asset.id} className="border-b transition-colors"
                      style={{ borderColor: 'var(--color-gray-1)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* File name */}
                      <td className="px-4 py-3 max-w-[160px]">
                        <div className="flex items-center gap-2">
                          <MimeIcon fileType={asset.fileType} />
                          <span className="truncate font-medium" style={{ color: 'var(--color-primary)' }}>
                            {asset.filename}
                          </span>
                        </div>
                      </td>
                      {/* Document type badge */}
                      <td className="px-4 py-3">
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap"
                          style={docTypeBadgeStyle(asset.documentType)}>
                          {docTypeLabel(asset.documentType)}
                        </span>
                      </td>
                      {/* Size */}
                      <td className="px-4 py-3" style={{ color: 'var(--color-body-color)' }}>
                        {formatBytes(asset.size)}
                      </td>
                      {/* Version */}
                      <td className="px-4 py-3" style={{ color: 'var(--color-body-color)' }}>
                        {asset.version || '—'}
                      </td>
                      {/* Downloadable toggle */}
                      <td className="px-4 py-3">
                        <button onClick={() => toggleDownloadable(asset)}
                          className="rounded-lg p-1 transition-colors"
                          title={t('dash.manage.toggle_downloadable', { defaultValue: 'Toggle downloadable' })}>
                          {asset.isDownloadable
                            ? <Eye className="h-4 w-4" style={{ color: 'var(--color-secondary)' }} />
                            : <EyeOff className="h-4 w-4" style={{ color: 'var(--color-dark-6)' }} />}
                        </button>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <ActionBtn onClick={() => handleDownload(asset.id)}
                            title={t('dash.manage.download', { defaultValue: 'Download' })}
                            hoverBg="rgba(19,194,150,0.10)" hoverColor="var(--color-secondary)">
                            <Download className="h-3.5 w-3.5" />
                          </ActionBtn>
                          <ActionBtn onClick={() => editingId === asset.id ? setEditingId(null) : startEdit(asset)}
                            title={t('dash.manage.edit', { defaultValue: 'Edit' })}
                            hoverBg="rgba(30,154,224,0.10)" hoverColor="var(--color-my-blue)">
                            <Pencil className="h-3.5 w-3.5" />
                          </ActionBtn>
                          <ActionBtn onClick={() => handleDelete(asset.id)} disabled={deleting}
                            title={t('dash.manage.delete', { defaultValue: 'Delete' })}
                            hoverBg="rgba(225,27,37,0.10)" hoverColor="var(--color-riec-red)">
                            <Trash2 className="h-3.5 w-3.5" />
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>

                    {/* Inline edit row */}
                    {editingId === asset.id && (
                      <tr key={`${asset.id}-edit`} style={{ background: 'var(--color-gray-1)' }}>
                        <td colSpan={6} className="px-4 py-3">
                          <div className="flex flex-wrap items-end gap-3">
                            {/* Document type */}
                            <div>
                              <label className="mb-1 block text-[10px] font-semibold" style={{ color: 'var(--color-body-color)' }}>
                                {t('dash.manage.doc_type', { defaultValue: 'Category' })}
                              </label>
                              <select value={editDraft.documentType}
                                onChange={(e) => setEditDraft((d) => ({ ...d, documentType: e.target.value }))}
                                className="rounded-xl border px-3 py-2 text-xs focus:outline-none"
                                style={{ borderColor: 'var(--color-stroke)', background: '#fff', color: 'var(--color-primary)', minWidth: 180 }}>
                                {DOCUMENT_TYPES.map((dt) => (
                                  <option key={dt} value={dt}>{docTypeLabel(dt)}</option>
                                ))}
                              </select>
                            </div>
                            {/* Version */}
                            <div>
                              <label className="mb-1 block text-[10px] font-semibold" style={{ color: 'var(--color-body-color)' }}>
                                {t('dash.manage.version', { defaultValue: 'Version' })}
                              </label>
                              <input value={editDraft.version}
                                onChange={(e) => setEditDraft((d) => ({ ...d, version: e.target.value }))}
                                className="rounded-xl border px-3 py-2 text-xs focus:outline-none"
                                style={{ borderColor: 'var(--color-stroke)', background: '#fff', color: 'var(--color-primary)', width: 100 }}
                                placeholder="v1.0"
                              />
                            </div>
                            {/* Downloadable toggle */}
                            <label className="flex items-center gap-2 cursor-pointer">
                              <div className="relative h-5 w-9 rounded-full transition-colors"
                                style={{ background: editDraft.isDownloadable ? 'var(--color-secondary)' : 'var(--color-dark-7)' }}>
                                <div className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform"
                                  style={{ transform: editDraft.isDownloadable ? 'translateX(16px)' : 'translateX(2px)' }} />
                              </div>
                              <input type="checkbox" className="sr-only"
                                checked={editDraft.isDownloadable}
                                onChange={(e) => setEditDraft((d) => ({ ...d, isDownloadable: e.target.checked }))} />
                              <span className="text-xs" style={{ color: 'var(--color-body-color)' }}>
                                {t('dash.manage.downloadable', { defaultValue: 'Downloadable' })}
                              </span>
                            </label>
                            <button onClick={() => saveEdit(asset.id)} disabled={updating}
                              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-colors disabled:opacity-60"
                              style={{ background: 'var(--color-secondary)' }}>
                              <Check className="h-3.5 w-3.5" />
                              {updating
                                ? t('dash.manage.saving', { defaultValue: 'Saving…' })
                                : t('dash.manage.save',   { defaultValue: 'Save' })}
                            </button>
                            <button onClick={() => setEditingId(null)}
                              className="rounded-xl border px-4 py-2 text-xs font-medium transition-colors"
                              style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}>
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {editError && (
                            <p className="mt-1.5 text-[10px]" style={{ color: 'var(--color-riec-red)' }}>{editError}</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionBtn({ onClick, title, hoverBg, hoverColor, disabled, children }) {
  return (
    <button onClick={onClick} title={title} disabled={disabled}
      className="rounded-lg p-1.5 transition-colors disabled:opacity-40"
      style={{ color: 'var(--color-dark-6)' }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = hoverColor } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-dark-6)' }}
    >
      {children}
    </button>
  )
}
