import { useRef, useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import gsap from 'gsap'
import { X, Check, Wrench, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import RichEditor from '../../../components/ui/RichEditor'
import { serviceSchema, SERVICE_EMPTY, inputCls } from './constants'
import { useCreateService, useUpdateService } from '../../../react-query'
import ServiceImagesPanel from './ServiceImagesPanel'

function FField({ name, label, required, hint, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-body-color)' }}>
        {label}{required && <span className="ml-0.5" style={{ color: 'var(--color-riec-red)' }}>*</span>}
        {hint && <span className="ml-1.5 font-normal" style={{ color: 'var(--color-dark-6)' }}>{hint}</span>}
      </label>
      {children}
      <ErrorMessage name={name} render={(msg) => (
        <p className="mt-1 text-[10px] font-medium" style={{ color: 'var(--color-riec-red)' }}>{msg}</p>
      )} />
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider"
      style={{ color: 'var(--color-dark-6)', borderTop: '1px solid var(--color-stroke)' }}>
      {children}
    </p>
  )
}

const TABS = [
  { key: 'details', labelKey: 'dash.services_page.tab_details', defaultLabel: 'Details', Icon: Wrench },
  { key: 'images',  labelKey: 'dash.services_page.tab_images',  defaultLabel: 'Images',  Icon: ImageIcon },
]

export default function ServiceEditDrawer({ editing, onClose }) {
  const { t }      = useTranslation()
  const overlayRef = useRef(null)
  const panelRef   = useRef(null)
  const [tab, setTab] = useState('details')

  const createServiceMutation = useCreateService()
  const updateServiceMutation = useUpdateService()
  const taskRowsRef = useRef([])

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
    gsap.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.38, ease: 'power3.out' })
  }, [])

  const handleClose = () => {
    gsap.to(panelRef.current, { x: '100%', duration: 0.3, ease: 'power3.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, onComplete: onClose })
  }

  const initial = editing ? {
    name:                editing.name                || '',
    shortDescription:    editing.shortDescription    || '',
    detailedDescription: editing.detailedDescription || '',
    order:               editing.order               ?? 0,
    title:               editing.title               || '',
    description:         editing.description         || '',
    process:             editing.process             || '',
    mainTasks:           editing.mainTasks           || [],
  } : SERVICE_EMPTY

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const body = Object.fromEntries(
        Object.entries(values).filter(([, v]) =>
          v !== '' && !(Array.isArray(v) && v.length === 0)
        )
      )
      if (editing) await updateServiceMutation.mutateAsync({ id: editing.id, ...body })
      else await createServiceMutation.mutateAsync(body)
      handleClose()
    } catch (err) {
      const msg = err?.response?.data?.message
      setStatus(Array.isArray(msg) ? msg.join(' · ') : (msg || 'Something went wrong'))
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
              style={{ background: 'rgba(238,122,24,0.10)', color: 'var(--color-riec-orange)' }}>
              <Wrench className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                {editing
                  ? t('dash.services_page.edit_title', { defaultValue: 'Edit Service' })
                  : t('dash.services_page.new_title',  { defaultValue: 'New Service' })}
              </p>
              {editing?.name && (
                <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>
                  {editing.name}
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

        {/* Tab bar — only when editing */}
        {editing && (
          <div className="flex border-b flex-shrink-0" style={{ borderColor: 'var(--color-stroke)' }}>
            {TABS.map(({ key, labelKey, defaultLabel, Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className="flex items-center gap-1.5 px-5 py-3 text-xs font-semibold transition-colors relative"
                style={{ color: tab === key ? 'var(--color-riec-orange)' : 'var(--color-body-color)' }}
                onMouseEnter={(e) => { if (tab !== key) e.currentTarget.style.background = 'var(--color-gray-1)' }}
                onMouseLeave={(e) => { if (tab !== key) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon className="h-3.5 w-3.5" />
                {t(labelKey, { defaultValue: defaultLabel })}
                {tab === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'var(--color-riec-orange)' }} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* Images tab */}
          {tab === 'images' && editing && (
            <ServiceImagesPanel serviceId={editing.id} />
          )}

          {/* Details tab (always shown when creating, or when tab === 'details') */}
          {(tab === 'details' || !editing) && (
            <Formik initialValues={initial} validationSchema={serviceSchema} onSubmit={handleSubmit}>
              {({ isSubmitting, status, values, setFieldValue }) => (
                <Form className="space-y-4">

                  <FField name="name" label={t('dash.services_page.field_name', { defaultValue: 'Name' })} required>
                    <Field name="name" placeholder="e.g. Architectural Design" className={inputCls} />
                  </FField>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-3">
                      <FField name="shortDescription" label={t('dash.services_page.field_short_desc', { defaultValue: 'Short Description' })} required>
                        <Field name="shortDescription" placeholder="Brief one-liner…" className={inputCls} />
                      </FField>
                    </div>
                    <FField name="order" label={t('dash.services_page.field_order', { defaultValue: 'Order' })} hint="(0+)">
                      <Field name="order" type="number" min="0" className={inputCls} />
                    </FField>
                  </div>

                  <SectionLabel>{t('dash.services_page.section_content', { defaultValue: 'Rich Content' })}</SectionLabel>

                  <FField name="title" label={t('dash.services_page.field_title', { defaultValue: 'Content Title' })}>
                    <Field name="title" placeholder="Building Your Vision" className={inputCls} />
                  </FField>

                  <FField name="detailedDescription" label={t('dash.services_page.field_detailed_desc', { defaultValue: 'Detailed Description' })}>
                    <RichEditor
                      value={values.detailedDescription}
                      onChange={(html) => setFieldValue('detailedDescription', html)}
                      placeholder="Full detailed description…"
                    />
                  </FField>

                  <FField name="description" label={t('dash.services_page.field_description', { defaultValue: 'Rich Description' })}>
                    <RichEditor
                      value={values.description}
                      onChange={(html) => setFieldValue('description', html)}
                      placeholder="Rich content description…"
                    />
                  </FField>

                  <FField name="process" label={t('dash.services_page.field_process', { defaultValue: 'Process' })}>
                    <RichEditor
                      value={values.process}
                      onChange={(html) => setFieldValue('process', html)}
                      placeholder="Our process involves…"
                    />
                  </FField>

                  <SectionLabel>{t('dash.services_page.section_tasks', { defaultValue: 'Main Tasks' })}</SectionLabel>

                  <FieldArray name="mainTasks">
                    {({ push, remove }) => {
                      const handleAddTask = () => {
                        push({ title: '', description: '' })
                        // animate the new row on next tick
                        setTimeout(() => {
                          const el = taskRowsRef.current[values.mainTasks.length]
                          if (el) gsap.fromTo(el, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' })
                        }, 0)
                      }
                      return (
                      <div className="space-y-3">
                        {values.mainTasks.map((_, idx) => (
                          <div key={idx} ref={(el) => { taskRowsRef.current[idx] = el }}
                            className="rounded-xl border p-3 space-y-2"
                            style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}>
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[10px] font-bold" style={{ color: 'var(--color-body-color)' }}>
                                {t('dash.services_page.task_n', { n: idx + 1, defaultValue: `Task ${idx + 1}` })}
                              </p>
                              <button type="button" onClick={() => remove(idx)}
                                className="rounded-lg p-1 transition-colors"
                                style={{ color: 'var(--color-dark-6)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(225,27,37,0.10)'; e.currentTarget.style.color = 'var(--color-riec-red)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-dark-6)' }}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <FField name={`mainTasks.${idx}.title`} label={t('dash.services_page.task_title', { defaultValue: 'Title' })} required>
                              <Field name={`mainTasks.${idx}.title`} placeholder="e.g. Site Analysis" className={inputCls} />
                            </FField>
                            <FField name={`mainTasks.${idx}.description`} label={t('dash.services_page.task_desc', { defaultValue: 'Description' })} required>
                              <Field name={`mainTasks.${idx}.description`} placeholder="We assess the site conditions…" className={inputCls} />
                            </FField>
                          </div>
                        ))}
                        <button type="button"
                          onClick={handleAddTask}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-2.5 text-xs font-semibold transition-colors"
                          style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-riec-orange)'; e.currentTarget.style.color = 'var(--color-riec-orange)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-stroke)'; e.currentTarget.style.color = 'var(--color-body-color)' }}>
                          <Plus className="h-3.5 w-3.5" />
                          {t('dash.services_page.add_task', { defaultValue: 'Add Task' })}
                        </button>
                      </div>
                      )
                    }}
                  </FieldArray>

                  {status && (
                    <p className="text-[10px]" style={{ color: 'var(--color-riec-red)' }}>{status}</p>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={handleClose}
                      className="rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors"
                      style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      {t('dash.services_page.cancel', { defaultValue: 'Cancel' })}
                    </button>
                    <button type="submit" disabled={isSubmitting}
                      className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white disabled:opacity-60 transition-colors"
                      style={{ background: 'var(--color-secondary)', boxShadow: '0 4px 12px rgba(19,194,150,0.30)' }}>
                      <Check className="h-3.5 w-3.5" />
                      {isSubmitting
                        ? t('dash.manage.saving', { defaultValue: 'Saving…' })
                        : editing
                          ? t('dash.services_page.update', { defaultValue: 'Update' })
                          : t('dash.services_page.create', { defaultValue: 'Create' })}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  )
}
