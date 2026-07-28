import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import RichEditor from '../../../components/ui/RichEditor'
import gsap from 'gsap'
import { X, Check } from 'lucide-react'
import { serviceSchema, SERVICE_EMPTY, inputCls } from './constants'

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

export default function ServiceModal({ editing, onClose, onCreate, onUpdate }) {
  const { t }      = useTranslation()
  const panelRef   = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
    gsap.fromTo(panelRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' })
  }, [])

  const close = () => {
    gsap.to(panelRef.current, { y: 30, opacity: 0, duration: 0.25, ease: 'power2.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose })
  }

  const initial = editing
    ? { name: editing.name || '', shortDescription: editing.shortDescription || '' }
    : { name: '', shortDescription: '' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div ref={overlayRef} onClick={close} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div ref={panelRef}
        className="relative z-10 w-full max-w-md rounded-3xl bg-white overflow-hidden"
        style={{ boxShadow: '0 25px 60px rgba(10,45,83,0.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'var(--color-stroke)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            {editing
              ? t('dash.services_page.edit_title', { defaultValue: 'Edit Service' })
              : t('dash.services_page.new_title',  { defaultValue: 'New Service' })}
          </h3>
          <button onClick={close} className="rounded-xl p-2 transition-colors hover:bg-[var(--color-gray-1)]"
            style={{ color: 'var(--color-body-color)' }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <Formik
            initialValues={initial}
            validationSchema={serviceSchema}
            onSubmit={async (values, { setSubmitting }) => {
              if (editing) await onUpdate({ id: editing.id, ...values })
              else await onCreate(values)
              setSubmitting(false)
              close()
            }}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-3">
                <FField name="name" label={t('dash.services_page.field_name', { defaultValue: 'Name' })} required>
                  <Field name="name" placeholder="e.g. Construction" className={inputCls} />
                </FField>
                <FField name="shortDescription" label={t('dash.services_page.field_short_desc', { defaultValue: 'Short Description' })} required>
                  <Field name="shortDescription" placeholder="Brief description…" className={inputCls} />
                </FField>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={close}
                    className="rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[var(--color-gray-1)]"
                    style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}>
                    {t('dash.services_page.cancel', { defaultValue: 'Cancel' })}
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white disabled:opacity-60 transition-colors"
                    style={{ background: 'var(--color-secondary)', boxShadow: '0 4px 12px rgba(19,194,150,0.30)' }}>
                    <Check className="h-3.5 w-3.5" />
                    {editing
                      ? t('dash.services_page.update', { defaultValue: 'Update' })
                      : t('dash.services_page.create', { defaultValue: 'Create' })}
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
