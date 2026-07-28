import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import RichEditor from '../../../components/ui/RichEditor'
import gsap from 'gsap'
import { X, Check } from 'lucide-react'
import { useCreateCareer, useUpdateCareer } from '../../../react-query'
import { careerSchema, CAREER_EMPTY, EMPLOYMENT_TYPES, inputCls } from './constants'

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

export default function CareerModal({ editing, onClose }) {
  const { t }      = useTranslation()
  const panelRef   = useRef(null)
  const overlayRef = useRef(null)

  const createCareerMutation = useCreateCareer()
  const updateCareerMutation = useUpdateCareer()

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
    gsap.fromTo(panelRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' })
  }, [])

  const close = () => {
    gsap.to(panelRef.current, { y: 30, opacity: 0, duration: 0.25, ease: 'power2.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose })
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
      close()
    } catch (err) {
      setStatus(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div ref={overlayRef} onClick={close} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div ref={panelRef}
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white overflow-hidden"
        style={{ boxShadow: '0 25px 60px rgba(10,45,83,0.18)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'var(--color-stroke)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            {editing
              ? t('dash.careers_page.edit_title', { defaultValue: 'Edit Career' })
              : t('dash.careers_page.post_btn',   { defaultValue: 'Post a Career' })}
          </h3>
          <button onClick={close} className="rounded-xl p-2 transition-colors hover:bg-[var(--color-gray-1)]"
            style={{ color: 'var(--color-body-color)' }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <Formik initialValues={initial} validationSchema={careerSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, status, values, setFieldValue }) => (
              <Form className="space-y-3">
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

                {status && <p className="text-[10px]" style={{ color: 'var(--color-riec-red)' }}>{status}</p>}

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={close}
                    className="rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[var(--color-gray-1)]"
                    style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}>
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
