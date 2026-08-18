import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, Pencil, Trash2, Check, X } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useXhrUpload } from '../../../hooks/useXhrUpload'
import { useGetServiceImages, useUpdateServiceImage, useDeleteServiceImage } from '../../../react-query'

export default function ServiceImagesPanel({ serviceId }) {
  const { t }    = useTranslation()
  const queryClient = useQueryClient()

  const { data: images = [], isLoading } = useGetServiceImages(serviceId)
  const updateImageMutation = useUpdateServiceImage()
  const deleteImageMutation = useDeleteServiceImage()

  const { upload, progress, uploading, error: uploadError } = useXhrUpload()

  const [editingId,    setEditingId]    = useState(null)
  const [captionDraft, setCaptionDraft] = useState('')
  const [orderDraft,   setOrderDraft]   = useState(0)

  /* ── Upload — all files in one request, field name: `files` ── */
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length) return
    const fd = new FormData()
    files.forEach((f) => fd.append('files', f))
    try {
      await upload(`/services/${serviceId}/images`, fd)
      await queryClient.invalidateQueries({ queryKey: ['service-images', serviceId] })
    } catch { /* error shown via uploadError */ }
  }

  /* ── Edit caption + order ── */
  const startEdit = (img) => {
    setEditingId(img.id)
    setCaptionDraft(img.caption || '')
    setOrderDraft(img.order ?? 0)
  }
  const saveEdit = async (imageId) => {
    await updateImageMutation.mutateAsync({ serviceId, imageId, caption: captionDraft, order: Number(orderDraft) })
    setEditingId(null)
  }

  /* ── Delete ── */
  const handleDelete = async (imageId) => {
    if (!window.confirm(t('dash.manage.confirm_delete_image', { defaultValue: 'Delete this image?' }))) return
    await deleteImageMutation.mutateAsync({ serviceId, imageId })
  }

  const updating = updateImageMutation.isPending
  const deleting = deleteImageMutation.isPending

  return (
    <div className="space-y-4">

      {/* Upload zone */}
      <label
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 transition-colors"
        style={{
          borderColor: uploading ? 'var(--color-riec-orange)' : 'var(--color-stroke)',
          background: 'var(--color-gray-1)',
        }}
        onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.borderColor = 'var(--color-riec-orange)'; e.currentTarget.style.background = 'rgba(238,122,24,0.04)' } }}
        onMouseLeave={(e) => { if (!uploading) { e.currentTarget.style.borderColor = 'var(--color-stroke)'; e.currentTarget.style.background = 'var(--color-gray-1)' } }}
      >
        <Upload className="h-5 w-5" style={{ color: 'var(--color-dark-6)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--color-body-color)' }}>
          {uploading
            ? `${t('dash.manage.uploading', { defaultValue: 'Uploading…' })} ${progress}%`
            : t('dash.manage.upload_images', { defaultValue: 'Click to upload images' })}
        </span>
        <span className="text-[10px]" style={{ color: 'var(--color-dark-6)' }}>
          {t('dash.manage.image_formats', { defaultValue: 'JPEG, PNG, WebP · max 10 MB each' })}
        </span>
        <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only"
          onChange={handleUpload} disabled={uploading} />
      </label>

      {/* Progress bar */}
      {uploading && (
        <div className="rounded-full overflow-hidden h-1.5" style={{ background: 'var(--color-gray-2)' }}>
          <div className="h-full rounded-full transition-all duration-200"
            style={{ width: `${progress}%`, background: 'var(--color-riec-orange)' }} />
        </div>
      )}
      {uploadError && (
        <p className="text-[10px]" style={{ color: 'var(--color-riec-red)' }}>{uploadError}</p>
      )}

      {isLoading && (
        <p className="text-xs text-center py-6" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.loading', { defaultValue: 'Loading…' })}
        </p>
      )}
      {!isLoading && images.length === 0 && (
        <p className="text-xs text-center py-6" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.manage.no_images', { defaultValue: 'No images yet. Upload some above.' })}
        </p>
      )}

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img) => (
          <div key={img.id}
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-1)' }}
          >
            {/* Image + hover actions */}
            <div className="relative group aspect-square">
              <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(10,45,83,0.45)' }}>
                <button onClick={() => startEdit(img)}
                  className="rounded-lg p-1.5"
                  style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--color-my-blue)' }}>
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(img.id)} disabled={deleting}
                  className="rounded-lg p-1.5 disabled:opacity-40"
                  style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--color-riec-red)' }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Inline edit row */}
            {editingId === img.id ? (
              <div className="p-2 space-y-1.5 border-t" style={{ borderColor: 'var(--color-stroke)' }}>
                <input
                  autoFocus
                  value={captionDraft}
                  onChange={(e) => setCaptionDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(img.id)}
                  placeholder={t('dash.manage.caption_placeholder', { defaultValue: 'Caption…' })}
                  className="w-full rounded-lg border px-2 py-1 text-[10px] focus:outline-none"
                  style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-primary)', background: 'var(--color-gray-1)' }}
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="number" min="0"
                    value={orderDraft}
                    onChange={(e) => setOrderDraft(e.target.value)}
                    placeholder="Order"
                    className="w-16 rounded-lg border px-2 py-1 text-[10px] focus:outline-none"
                    style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-primary)', background: 'var(--color-gray-1)' }}
                  />
                  <button onClick={() => saveEdit(img.id)} disabled={updating}
                    className="rounded-lg p-1.5 disabled:opacity-40"
                    style={{ background: 'rgba(19,194,150,0.12)', color: 'var(--color-secondary)' }}>
                    <Check className="h-3 w-3" />
                  </button>
                  <button onClick={() => setEditingId(null)}
                    className="rounded-lg p-1.5"
                    style={{ color: 'var(--color-dark-6)' }}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              (img.caption || img.order != null) && (
                <div className="flex items-center justify-between px-2 py-1.5 border-t"
                  style={{ borderColor: 'var(--color-stroke)' }}>
                  <p className="text-[10px] truncate flex-1" style={{ color: 'var(--color-body-color)' }}>
                    {img.caption || 'No caption'}
                  </p>
                  {img.order != null && (
                    <span className="text-[10px] flex-shrink-0 ml-1" style={{ color: 'var(--color-dark-6)' }}>
                      #{img.order}
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
