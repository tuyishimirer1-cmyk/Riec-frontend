import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import gsap from 'gsap'
import { X, Check, Building2 } from 'lucide-react'
import RichEditor from '../../../components/ui/RichEditor'
import { careerSchema, CAREER_EMPTY, EMPLOYMENT_TYPES, inputCls } from './constants'
import { useCreateCareer, useUpdateCareer } from '../../../react-query'

function FField({ name, label, required, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-body-color)' }}>
        {label}{required && <span className="ml-0.5" style={{ color: 'var(--color-riec-red)' }}>*</span>}
      </label>
      {children}
      <ErrorMessage name={name} render={(msg) => (
        <p className="mt-1 text-[10px] font-medium" style={{ color: 'var(--color-riec-red)' }}>{msg}</p>
      )} />
    </div>
  )
}

export default function CareerEditDrawer({ editing, onClose }) {
  const { t }      = useTranslation()
  const overlayRef = useRef(null)
  const panelRef   = useRef(null)

  const createCareerMutation = useCreateCareer()
  const updateCareerMutation = useUpdateCareer()

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
    gsap.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.38, ease: 'power3.out' })
  }, [])

  const handleClose = () => {
    gsap.to(panelRef.current, { x: '100%', duration: 0.3, ease: 'power3.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, onComplete: onClose })
  }

  const initial = editing ? {
    title:            editing.title            || '',
    department:       editing.department       || '',
    location:         editing.location         || '',
    employmentType:   editing.employmentType   || '',
    description:      editing.description      || '',
    requirements:     editing.requirements     || '',
    responsibilities: editing.responsibilities || '',
  } : CAREER_EMPTY

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      if (editing) await updateCareerMutation.mutateAsync({ id: editing.id, ...values })
      else await createCareerMutation.mutateAsync(values)
      handleClose()
    } catch (err) {
      setStatus(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div ref={overlayRef} onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div ref={panelRef}
        className="relative z-10 flex flex-col bg-white w-full max-w-lg h-full"
        style={{ boxShadow: '-8px 0 40px rgba(10,45,83,0.14)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4 flex-shrink-0"
          style={{ borderColor: 'var(--color-stroke)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: 'rgba(19,194,150,0.10)', color: 'var(--color-secondary)' }}>
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                {editing
                  ? t('dash.careers_page.edit_title', { defaultValue: 'Edit Career' })
                  : t('dash.careers_page.post_btn',   { defaultValue: 'Post a Career' })}
              </p>
              {editing && (
                <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>
                  {editing.department} · {editing.location}
                </p>
              )}
            </div>
          </div>
          <button onClick={handleClose}
            className="rounded-xl p-2 transition-colors"
            style={{ color: 'var(--color-body-color)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto p-5">
          <Formik
            initialValues={initial}
            validationSchema={careerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status, values, setFieldValue }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FField name="title" label={t('dash.careers_page.field_title', { defaultValue: 'Title' })} required>
                    <Field name="title" placeholder="e.g. Site Engineer" className={inputCls} />
                  </FField>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FField name="department" label={t('dash.careers_page.field_dept', { defaultValue: 'Department' })} required>
                    <Field name="department" placeholder="Engineering" className={inputCls} />
                  </FField>
                  <FField name="location" label={t('dash.careers_page.field_location', { defaultValue: 'Location' })} required>
                    <Field name="location" placeholder="Kigali" className={inputCls} />
                  </FField>
                </div>
                <FField name="employmentType" label={t('dash.careers_page.field_type', { defaultValue: 'Employment Type' })} required>
                  <Field as="select" name="employmentType" className={inputCls + ' cursor-pointer'}>
                    <option value="">{t('dash.careers_page.select_type', { defaultValue: 'Select…' })}</option>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                    ))}
                  </Field>
                </FField>
                <FField name="description" label={t('dash.careers_page.field_desc', { defaultValue: 'Description' })} required>
                  <RichEditor
                    value={values.description}
                    onChange={(html) => setFieldValue('description', html)}
                    placeholder="Role description…"
                  />
                </FField>
                <FField name="requirements" label={t('dash.careers_page.field_requirements', { defaultValue: 'Requirements' })} required>
                  <RichEditor
                    value={values.requirements}
                    onChange={(html) => setFieldValue('requirements', html)}
                    placeholder="Required qualifications…"
                  />
                </FField>
                <FField name="responsibilities" label={t('dash.careers_page.field_responsibilities', { defaultValue: 'Responsibilities' })} required>
                  <RichEditor
                    value={values.responsibilities}
                    onChange={(html) => setFieldValue('responsibilities', html)}
                    placeholder="Key responsibilities…"
                  />
                </FField>

                {status && (
                  <p className="text-[10px]" style={{ color: 'var(--color-riec-red)' }}>{status}</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={handleClose}
                    className="rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors"
                    style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    {t('dash.careers_page.cancel', { defaultValue: 'Cancel' })}
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white disabled:opacity-60 transition-colors"
                    style={{ background: 'var(--color-secondary)', boxShadow: '0 4px 12px rgba(19,194,150,0.30)' }}>
                    <Check className="h-3.5 w-3.5" />
                    {isSubmitting
                      ? t('dash.manage.saving', { defaultValue: 'Saving…' })
                      : editing
                        ? t('dash.careers_page.update', { defaultValue: 'Update' })
                        : t('dash.careers_page.post',   { defaultValue: 'Post Career' })}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
