/* eslint-disable no-unused-vars */
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, Pencil, Trash2, GripVertical, Check } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useXhrUpload } from '../../../../hooks/useXhrUpload'
import { useGetProjectImages, useReorderProjectImages, useUpdateProjectImage, useDeleteProjectImage } from '../../../../react-query'

export default function ImagesPanel({ projectId }) {
  const { t }        = useTranslation()
  const queryClient = useQueryClient()
  const { data: images = [], isLoading } = useGetProjectImages(projectId)

  const { upload, progress, uploading, error: uploadError } = useXhrUpload()
  const reorderImagesMutation = useReorderProjectImages()
  const updateImageMutation = useUpdateProjectImage()
  const deleteImageMutation = useDeleteProjectImage()

  const [editingId,    setEditingId]    = useState(null)
  const [captionDraft, setCaptionDraft] = useState('')
  const [dragOverId,   setDragOverId]  = useState(null)
  const dragIdRef = useRef(null)

  /* ── Upload ── */
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const fd = new FormData()
    files.forEach((f) => fd.append('files', f))
    try {
      await upload(`/projects/${projectId}/images`, fd)
      await queryClient.invalidateQueries({ queryKey: ['project-images', projectId] })
    } catch { /* error shown via uploadError */ }
    e.target.value = ''
  }

  /* ── Drag-to-reorder ── */
  const handleDragStart = (id) => { dragIdRef.current = id }
  const handleDragOver  = (e, id) => { e.preventDefault(); setDragOverId(id) }
  const handleDrop      = async (targetId) => {
    setDragOverId(null)
    const fromId = dragIdRef.current
    if (!fromId || fromId === targetId) return
    const ids      = images.map((img) => img.id)
    const fromIdx  = ids.indexOf(fromId)
    const toIdx    = ids.indexOf(targetId)
    if (fromIdx < 0 || toIdx < 0) return
    const reordered = [...ids]
    reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, fromId)
    await reorderImagesMutation.mutateAsync({ projectId, images: reordered })
  }

  /* ── Caption edit ── */
  const startEdit   = (img) => { setEditingId(img.id); setCaptionDraft(img.caption || '') }
  const saveCaption = async (imageId) => {
    await updateImageMutation.mutateAsync({ projectId, imageId, caption: captionDraft })
    setEditingId(null)
  }

  /* ── Delete ── */
  const handleDelete = async (imageId) => {
    if (!window.confirm(t('dash.manage.confirm_delete_image', { defaultValue: 'Delete this image?' }))) return
    await deleteImageMutation.mutateAsync({ projectId, imageId })
  }

  const updating = updateImageMutation.isPending
  const deleting = deleteImageMutation.isPending

  return (
    <div className="space-y-4">

      {/* Upload zone */}
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 transition-colors"
        style={{ borderColor: uploading ? 'var(--color-riec-orange)' : 'var(--color-stroke)', background: 'var(--color-gray-1)' }}
        onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.borderColor = 'var(--color-riec-orange)'; e.currentTarget.style.background = 'rgba(238,122,24,0.04)' } }}
        onMouseLeave={(e) => { if (!uploading) { e.currentTarget.style.borderColor = 'var(--color-stroke)'; e.currentTarget.style.background = 'var(--color-gray-1)' } }}
      >
        <Upload className="h-5 w-5" style={{ color: 'var(--color-dark-6)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--color-body-color)' }}>
          {uploading
            ? t('dash.manage.uploading', { defaultValue: 'Uploading…' })
            : t('dash.manage.upload_images', { defaultValue: 'Click to upload images' })}
        </span>
        <input type="file" multiple accept="image/*" className="sr-only"
          onChange={handleUpload} disabled={uploading} />
      </label>

      {/* Progress bar */}
      {uploading && (
        <ProgressBar progress={progress} color="var(--color-riec-orange)" />
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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img) => (
          <div key={img.id}
            draggable
            onDragStart={() => handleDragStart(img.id)}
            onDragOver={(e) => handleDragOver(e, img.id)}
            onDrop={() => handleDrop(img.id)}
            onDragEnd={() => setDragOverId(null)}
            className="rounded-xl overflow-hidden border transition-all"
            style={{
              borderColor: dragOverId === img.id ? 'var(--color-riec-orange)' : 'var(--color-stroke)',
              boxShadow: 'var(--shadow-1)',
            }}
          >
            <div className="relative group aspect-square">
              <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                style={{ background: 'rgba(10,45,83,0.45)' }}>
                <button onClick={() => startEdit(img)}
                  className="rounded-lg p-1.5 bg-white transition-colors"
                  style={{ color: 'var(--color-my-blue)' }}>
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(img.id)} disabled={deleting}
                  className="rounded-lg p-1.5 bg-white transition-colors"
                  style={{ color: 'var(--color-riec-red)' }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <GripVertical className="h-4 w-4 cursor-grab" style={{ color: 'rgba(255,255,255,0.8)' }} />
              </div>
            </div>

            {editingId === img.id ? (
              <div className="p-2 flex gap-1.5 border-t" style={{ borderColor: 'var(--color-stroke)' }}>
                <input autoFocus value={captionDraft}
                  onChange={(e) => setCaptionDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveCaption(img.id)}
                  className="flex-1 rounded-lg border px-2 py-1 text-[10px] focus:outline-none"
                  style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-primary)', background: 'var(--color-gray-1)' }}
                  placeholder={t('dash.manage.caption_placeholder', { defaultValue: 'Caption…' })}
                />
                <button onClick={() => saveCaption(img.id)} disabled={updating}
                  className="rounded-lg p-1.5 transition-colors"
                  style={{ background: 'rgba(19,194,150,0.12)', color: 'var(--color-secondary)' }}>
                  <Check className="h-3 w-3" />
                </button>
              </div>
            ) : img.caption ? (
              <p className="px-2 py-1.5 text-[10px] truncate" style={{ color: 'var(--color-body-color)' }}>
                {img.caption}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProgressBar({ progress, color }) {
  return (
    <div className="rounded-full overflow-hidden h-1.5" style={{ background: 'var(--color-gray-2)' }}>
      <div className="h-full rounded-full transition-all duration-200"
        style={{ width: `${progress}%`, background: color }} />
    </div>
  )
}
