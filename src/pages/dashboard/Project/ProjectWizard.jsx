import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight, Check, X, AlertCircle, Loader2 } from 'lucide-react'
import { useXhrUpload } from '../../../hooks/useXhrUpload'
import { STEPS, EMPTY } from './constants'
import StepBar from './StepBar'
import { StepBasicInfo, StepDetails, StepSettings, StepMedia } from './WizardSteps'

export default function ProjectWizard({ editing, onClose, onCreate, onUpdate }) {
  const { t }      = useTranslation()
  const [step,          setStep]         = useState(0)
  const [assetBatches,  setAssetBatches] = useState([]) // [{ files, documentType }]
  const [images,        setImages]       = useState([])
  const [serviceSlugs,  setServiceSlugs] = useState([])
  const [saving,        setSaving]       = useState(false)
  const [saveError,     setSaveError]    = useState(null)
  const [uploadLabel,   setUploadLabel]  = useState('')

  const panelRef   = useRef(null)
  const overlayRef = useRef(null)
  const stepRef    = useRef(null)
  const errorRef   = useRef(null)

  const imgUpload   = useXhrUpload()
  const assetUpload = useXhrUpload()

  const toggleService = (slug) => {
    setServiceSlugs((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug])
  }

  /* ── Entrance ── */
  useEffect(() => {
    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 })
    gsap.fromTo(panelRef.current,
      { y: 80, opacity: 0, scale: 0.94 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.05 })
  }, [])

  /* ── Sync services when editing ── */
  useEffect(() => {
    if (editing?.services) {
      const slugs = editing.services
        .map((s) => s?.service?.slug)
        .filter(Boolean)
      setServiceSlugs(slugs)
    }
  }, [editing])

  /* ── Step transition ── */
  const animateStep = (dir) => {
    gsap.fromTo(stepRef.current,
      { x: dir > 0 ? 50 : -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.28, ease: 'power2.out' })
  }

  const goNext = () => { setStep((s) => s + 1); animateStep(1) }
  const goPrev = () => { setStep((s) => s - 1); animateStep(-1) }

  /* ── Error shake ── */
  const shakeError = () => {
    if (!errorRef.current) return
    gsap.fromTo(errorRef.current,
      { x: -6 },
      { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' })
  }

  const handleClose = () => {
    gsap.to(panelRef.current, { y: 50, opacity: 0, scale: 0.95, duration: 0.28, ease: 'power2.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, onComplete: onClose })
  }

  /* ── Final submit ── */
  const handleFinish = async (values) => {
    setSaving(true)
    setSaveError(null)
    try {
      const payload = {
        title:       values.title,
        description: values.description,
        location:    values.location,
        type:        values.type,
        category:    values.category,
        serviceSlugs: serviceSlugs.length ? serviceSlugs : [],
        featured:    !!values.featured,
        purchasable: !!values.purchasable,
        youtubeVideoUrl: values.youtubeVideoUrl || undefined,
        basePrice: values.basePrice ? Number(values.basePrice) : undefined,
        currency: values.currency || 'USD',
      }

      let project
      if (editing) {
        project = await onUpdate({ id: editing.id, ...payload })
      } else {
        project = await onCreate(payload)
      }

      const pid = project?.id || editing?.id
      if (pid) {
        if (images.length) {
          setUploadLabel(t('dash.wizard.uploading_images', { defaultValue: 'Uploading images…' }))
          const fd = new FormData()
          images.forEach((f) => fd.append('files', f))
          await imgUpload.upload(`/projects/${pid}/images`, fd).catch(() => {})
        }
        for (let i = 0; i < assetBatches.length; i++) {
          const batch = assetBatches[i]
          if (!batch.files.length) continue
          setUploadLabel(t('dash.wizard.uploading_assets', {
            n: i + 1, total: assetBatches.length,
            defaultValue: `Uploading assets (${i + 1}/${assetBatches.length})…`,
          }))
          const fd = new FormData()
          batch.files.forEach((f) => fd.append('files', f))
          fd.append('documentType', batch.documentType)
          await assetUpload.upload(`/projects/${pid}/assets`, fd).catch(() => {})
        }
      }
      handleClose()
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Something went wrong'
      setSaveError(msg)
      shakeError()
    } finally {
      setSaving(false)
    }
  }

  const initialValues = editing ? {
    title:       editing.title       || '',
    description: editing.description || '',
    location:    editing.location    || '',
    type:        editing.type        || '',
    category:    editing.category    || '',
    featured:    !!editing.featured,
    purchasable: !!editing.purchasable,
    youtubeVideoUrl: editing.youtubeVideoUrl || '',
    basePrice:   editing.basePrice   || '',
    currency:    editing.currency    || 'USD',
  } : EMPTY

  const isLastStep = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div ref={overlayRef} onClick={handleClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div ref={panelRef}
        className="relative z-10 w-full max-w-xl rounded-3xl bg-white"
        style={{ boxShadow: '0 32px 80px rgba(10,45,83,0.22)', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b px-6 py-4 flex-shrink-0"
          style={{ borderColor: 'var(--color-stroke)' }}>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
              {editing
                ? t('dash.wizard.edit_title', { defaultValue: 'Edit Project' })
                : t('dash.wizard.new_title',  { defaultValue: 'New Project' })}
            </h3>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-body-color)' }}>
              {t('dash.wizard.step_of', {
                step: step + 1,
                total: STEPS.length,
                defaultValue: `Step ${step + 1} of ${STEPS.length}`,
              })}
            </p>
          </div>
          <button onClick={handleClose}
            className="rounded-xl p-2 transition-colors hover:bg-[var(--color-gray-1)]"
            style={{ color: 'var(--color-body-color)' }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 pt-5 pb-6">
          <StepBar current={step} />

          <Formik
            initialValues={initialValues}
            validationSchema={STEPS[step].schema}
            validateOnChange={false}
            validateOnBlur
            onSubmit={async (values) => {
              if (!isLastStep) goNext()
              else await handleFinish(values)
            }}
          >
            {({ values, setFieldValue }) => (
              <Form noValidate>
                <div ref={stepRef} style={{ minHeight: 220 }}>
                  {step === 0 && <StepBasicInfo />}
                  {step === 1 && <StepDetails serviceSlugs={serviceSlugs} onToggleService={toggleService} />}
                  {step === 2 && <StepSettings values={values} setFieldValue={setFieldValue} />}
                  {step === 3 && (
                    <StepMedia
                      images={images}       setImages={setImages}
                      assetBatches={assetBatches} setAssetBatches={setAssetBatches}
                    />
                  )}
                </div>

                {/* Save error */}
                {saveError && (
                  <div ref={errorRef}
                    className="mt-4 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium"
                    style={{ borderColor: 'var(--color-riec-red)', background: 'rgba(225,27,37,0.06)', color: 'var(--color-riec-red)' }}>
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {saveError}
                  </div>
                )}

                {/* ── Footer ── */}
                <div className="mt-6 flex items-center justify-between">
                  <button type="button" onClick={goPrev} disabled={step === 0}
                    className="flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all disabled:opacity-30"
                    style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
                    onMouseEnter={(e) => { if (step > 0) e.currentTarget.style.background = 'var(--color-gray-1)' }}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    {t('dash.wizard.back', { defaultValue: 'Back' })}
                  </button>

                  {!isLastStep ? (
                    <button type="submit"
                      className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all"
                      style={{ background: 'var(--color-riec-orange)', boxShadow: '0 4px 14px rgba(238,122,24,0.40)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-riec-orange-light)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-riec-orange)'}
                    >
                      {t('dash.wizard.next', { defaultValue: 'Next' })}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <div className="flex flex-col items-end gap-1.5">
                      {/* Upload progress bars */}
                      {saving && (imgUpload.uploading || assetUpload.uploading) && (
                        <div className="w-48 space-y-1">
                          <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>{uploadLabel}</p>
                          <div className="rounded-full overflow-hidden h-1.5" style={{ background: 'var(--color-gray-2)' }}>
                            <div className="h-full rounded-full transition-all duration-150"
                              style={{
                                width: `${imgUpload.uploading ? imgUpload.progress : assetUpload.progress}%`,
                                background: 'var(--color-secondary)',
                              }} />
                          </div>
                          <p className="text-[10px] text-right" style={{ color: 'var(--color-secondary)' }}>
                            {imgUpload.uploading ? imgUpload.progress : assetUpload.progress}%
                          </p>
                        </div>
                      )}
                      <button type="submit" disabled={saving}
                        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-60"
                        style={{ background: 'var(--color-secondary)', boxShadow: '0 4px 14px rgba(19,194,150,0.40)' }}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            {uploadLabel || t('dash.wizard.saving', { defaultValue: 'Saving…' })}
                          </>
                        ) : (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            {editing
                              ? t('dash.wizard.update', { defaultValue: 'Update' })
                              : t('dash.wizard.create', { defaultValue: 'Create' })}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
