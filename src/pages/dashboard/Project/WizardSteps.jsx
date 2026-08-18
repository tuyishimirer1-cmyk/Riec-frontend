import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, useFormikContext } from 'formik'
import RichEditor from '../../../components/ui/RichEditor'
import { Upload, Image as ImageIcon, Layers, X, FileText } from 'lucide-react'
import FField from './FField'
import { inputCls, selectCls, TYPES, CATEGORIES, DOCUMENT_TYPES } from './constants'
import { useGetServices } from '../../../react-query'

/* ── Rich description editor wired to Formik context ── */
function DescriptionEditor({ placeholder = 'Project description…' }) {
  const { values, setFieldValue } = useFormikContext()
  return (
    <RichEditor
      value={values.description}
      onChange={(html) => setFieldValue('description', html)}
      placeholder={placeholder}
    />
  )
}

/* ── Step 0: Basic Info ── */
export function StepBasicInfo() {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <FField name="title" label={t('dash.wizard.field_title', { defaultValue: 'Title' })} required>
        <Field name="title" placeholder="e.g. Kigali Heights Tower" className={inputCls} />
      </FField>
      <FField name="description" label={t('dash.wizard.field_description', { defaultValue: 'Description' })} required>
        <DescriptionEditor />
      </FField>
      <FField name="location" label={t('dash.wizard.field_location', { defaultValue: 'Location' })} required>
        <Field name="location" placeholder="e.g. Kigali, Rwanda" className={inputCls} />
      </FField>
      <FField name="youtubeVideoUrl" label={t('dash.wizard.field_youtube_url', { defaultValue: 'YouTube Video URL (optional)' })}>
        <Field name="youtubeVideoUrl" placeholder="e.g. https://youtube.com/watch?v=..." className={inputCls} />
      </FField>
    </div>
  )
}

/* ── Step 1: Details ── */
export function StepDetails({ serviceSlugs, onToggleService }) {
  const { t } = useTranslation()
  const { data: servicesData } = useGetServices({ limit: 100 })
  const services = servicesData?.items || []

  return (
    <div className="space-y-4">
      <FField name="type" label={t('dash.wizard.field_type', { defaultValue: 'Project Type' })} required>
        <Field as="select" name="type" className={selectCls}>
          <option value="">{t('dash.wizard.select_type', { defaultValue: 'Select type…' })}</option>
          {TYPES.map((type) => (
            <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
          ))}
        </Field>
      </FField>
      <FField name="category" label={t('dash.wizard.field_category', { defaultValue: 'Category' })} required>
        <Field as="select" name="category" className={selectCls}>
          <option value="">{t('dash.wizard.select_category', { defaultValue: 'Select category…' })}</option>
          {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </Field>
      </FField>
      <div>
        <p className="mb-2 text-xs font-semibold" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.wizard.field_price', { defaultValue: 'Base Price (optional)' })}
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Field as="select" name="currency" className={selectCls}>
            <option value="USD">USD ($)</option>
            <option value="RWF">RWF (FRw)</option>
          </Field>
          <div className="col-span-2">
            <Field name="basePrice" type="number" placeholder="e.g. 150000" className={inputCls} min="0" step="1000" />
          </div>
        </div>
        <p className="mt-1 text-[10px]" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.wizard.field_price_hint', { defaultValue: 'Leave empty to show "Price on request"' })}
        </p>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.wizard.field_services', { defaultValue: 'Services' })}
        </p>
        <div className="space-y-2">
          {services.map((svc) => {
            const slug = svc.slug
            const checked = serviceSlugs?.includes(slug)
            return (
              <label key={svc.id} className="flex items-center gap-3 rounded-xl border px-4 py-2.5 cursor-pointer transition-colors hover:bg-[var(--color-gray-1)]"
                style={{ borderColor: 'var(--color-stroke)' }}>
                <input
                  type="checkbox"
                  checked={!!checked}
                  onChange={() => onToggleService?.(slug)}
                  className="h-4 w-4 rounded border-[var(--color-stroke)] text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]"
                />
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>{svc.name}</p>
                  {svc.shortDescription && (
                    <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>{svc.shortDescription}</p>
                  )}
                </div>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const Toggle = ({ values, setFieldValue, field, label, desc, activeColor }) => (
  <label className="flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--color-gray-1)]"
    style={{ borderColor: 'var(--color-stroke)' }}>
    <div className="relative h-5 w-9 rounded-full transition-colors flex-shrink-0"
      style={{ background: values[field] ? activeColor : 'var(--color-dark-7)' }}>
      <div className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform"
        style={{ transform: values[field] ? 'translateX(16px)' : 'translateX(2px)' }} />
    </div>
    <input type="checkbox" checked={values[field]}
      onChange={(e) => setFieldValue(field, e.target.checked)} className="sr-only" />
    <div>
      <p className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>{label}</p>
      <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>{desc}</p>
    </div>
  </label>
)

/* ── Step 2: Settings ── */
export function StepSettings({ values, setFieldValue }) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <p className="text-xs" style={{ color: 'var(--color-body-color)' }}>
        {t('dash.wizard.settings_hint', { defaultValue: 'Configure visibility and purchase options.' })}
      </p>
      <Toggle
        values={values} setFieldValue={setFieldValue}
        field="featured"
        label={t('dash.wizard.field_featured', { defaultValue: 'Featured' })}
        desc={t('dash.wizard.field_featured_desc', { defaultValue: 'Show on homepage featured section' })}
        activeColor="var(--color-riec-orange)"
      />
      <Toggle
        values={values} setFieldValue={setFieldValue}
        field="purchasable"
        label={t('dash.wizard.field_purchasable', { defaultValue: 'Plan Purchasable' })}
        desc={t('dash.wizard.field_purchasable_desc', { defaultValue: 'Allow clients to purchase engineering plans' })}
        activeColor="var(--color-secondary)"
      />
    </div>
  )
}

/* ── Step 3: Media ── */
export function StepMedia({ images, setImages, assetBatches, setAssetBatches }) {
  const { t } = useTranslation()

  /* ── Images ── */
  const handleImageFiles = (files) => setImages((prev) => {
    const existing = new Set(prev.map((f) => f.name + f.size))
    return [...prev, ...files.filter((f) => !existing.has(f.name + f.size))]
  })
  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx))

  /* ── Asset batches ── */
  const addBatch = (files, documentType) => {
    if (!files.length) return
    setAssetBatches((prev) => [...prev, { files, documentType }])
  }
  const removeBatch = (bIdx) => setAssetBatches((prev) => prev.filter((_, i) => i !== bIdx))
  const removeFileFromBatch = (bIdx, fIdx) => {
    setAssetBatches((prev) => {
      const next = prev.map((b, i) => i === bIdx
        ? { ...b, files: b.files.filter((_, fi) => fi !== fIdx) }
        : b
      )
      return next.filter((b) => b.files.length > 0)
    })
  }
  const updateBatchDocType = (bIdx, documentType) => {
    setAssetBatches((prev) => prev.map((b, i) => i === bIdx ? { ...b, documentType } : b))
  }

  return (
    <div className="space-y-5">

      {/* ── Images section ── */}
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: 'var(--color-body-color)' }}>
          <ImageIcon className="h-3.5 w-3.5" style={{ color: 'var(--color-riec-orange)' }} />
          {t('dash.wizard.field_images', { defaultValue: 'Project Images (optional)' })}
        </p>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed py-4 transition-all"
          style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-riec-orange)'; e.currentTarget.style.background = 'rgba(238,122,24,0.04)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-stroke)'; e.currentTarget.style.background = 'var(--color-gray-1)' }}
        >
          <Upload className="h-4 w-4" style={{ color: 'var(--color-dark-6)' }} />
          <span className="text-xs" style={{ color: 'var(--color-body-color)' }}>
            {t('dash.wizard.click_images', { defaultValue: 'Click to add images' })}
          </span>
          <input type="file" multiple accept="image/*" className="sr-only"
            onChange={(e) => handleImageFiles(Array.from(e.target.files || []))} />
        </label>

        {images.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {images.map((f, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border aspect-square"
                style={{ borderColor: 'var(--color-stroke)' }}>
                <img src={URL.createObjectURL(f)} alt={f.name}
                  className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-0.5 right-0.5 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(225,27,37,0.85)', color: '#fff' }}>
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Assets section ── */}
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: 'var(--color-body-color)' }}>
          <Layers className="h-3.5 w-3.5" style={{ color: 'var(--color-my-blue)' }} />
          {t('dash.wizard.field_assets', { defaultValue: 'Project Documents / Assets (optional)' })}
        </p>

        {/* Add new batch */}
        <AssetDropZone onAdd={addBatch} t={t} />

        {/* Existing batches */}
        {assetBatches.length > 0 && (
          <div className="mt-3 space-y-2">
            {assetBatches.map((batch, bIdx) => (
              <div key={bIdx} className="rounded-xl border p-3 space-y-2"
                style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}>
                <div className="flex items-center gap-2">
                  <select
                    value={batch.documentType}
                    onChange={(e) => updateBatchDocType(bIdx, e.target.value)}
                    className="flex-1 rounded-lg border px-2 py-1.5 text-[10px] focus:outline-none cursor-pointer"
                    style={{ borderColor: 'var(--color-stroke)', background: '#fff', color: 'var(--color-primary)' }}
                  >
                    {DOCUMENT_TYPES.map((dt) => (
                      <option key={dt} value={dt}>{dt.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => removeBatch(bIdx)}
                    className="rounded-lg p-1 transition-colors flex-shrink-0"
                    style={{ color: 'var(--color-dark-6)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(225,27,37,0.10)'; e.currentTarget.style.color = 'var(--color-riec-red)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-dark-6)' }}>
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {batch.files.map((f, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                      style={{ background: '#fff', border: '1px solid var(--color-stroke)' }}>
                      <FileText className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--color-my-blue)' }} />
                      <span className="flex-1 truncate text-[10px]" style={{ color: 'var(--color-primary)' }}>{f.name}</span>
                      <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--color-body-color)' }}>
                        {(f.size / 1024).toFixed(0)} KB
                      </span>
                      <button type="button" onClick={() => removeFileFromBatch(bIdx, fIdx)}
                        className="flex-shrink-0 rounded p-0.5 transition-colors"
                        style={{ color: 'var(--color-dark-6)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-riec-red)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-dark-6)'}>
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Asset drop zone sub-component ── */
function AssetDropZone({ onAdd, t }) {
  const [docType, setDocType] = useState('PRESENTATION')

  return (
    <div className="rounded-xl border-2 border-dashed p-3 space-y-2 transition-all"
      style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}>
      <div className="flex items-center gap-2">
        <select value={docType} onChange={(e) => setDocType(e.target.value)}
          className="flex-1 rounded-lg border px-2 py-1.5 text-[10px] focus:outline-none cursor-pointer"
          style={{ borderColor: 'var(--color-stroke)', background: '#fff', color: 'var(--color-primary)' }}>
          {DOCUMENT_TYPES.map((dt) => (
            <option key={dt} value={dt}>{dt.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-bold transition-all flex-shrink-0"
          style={{ borderColor: 'var(--color-my-blue)', background: 'rgba(30,154,224,0.06)', color: 'var(--color-my-blue)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(30,154,224,0.12)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(30,154,224,0.06)'}
        >
          <Upload className="h-3 w-3" />
          {t('dash.wizard.click_docs', { defaultValue: 'Add files' })}
          <input type="file" multiple className="sr-only"
            onChange={(e) => { onAdd(Array.from(e.target.files || []), docType); e.target.value = '' }} />
        </label>
      </div>
      <p className="text-[10px]" style={{ color: 'var(--color-dark-6)' }}>
        {t('dash.wizard.assets_hint', { defaultValue: 'Select a document category then pick files. Repeat for each category.' })}
      </p>
    </div>
  )
}


