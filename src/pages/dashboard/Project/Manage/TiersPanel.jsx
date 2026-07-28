import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import RichEditor from '../../../../components/ui/RichEditor'
import {
  useGetProjectTiers,
  useCreateProjectTier,
  useUpdateProjectTier,
  useDeleteProjectTier,
} from '../../../../react-query'
import { inputCls, selectCls } from '../constants'
import FField from '../FField'

const tierSchema = Yup.object({
  name:        Yup.string().min(2).required('Name is required'),
  amount:      Yup.number().min(0).required('Price is required'),
  currency:    Yup.string().required(),
  description: Yup.string(),
  isActive:    Yup.boolean(),
})

const CURRENCIES = ['RWF', 'USD', 'EUR']

function formatPrice(amount, currency) {
  try {
    return new Intl.NumberFormat('en-RW', { style: 'currency', currency: currency || 'RWF' }).format(amount)
  } catch {
    return `${currency} ${amount}`
  }
}

/* ── Inline tier form (create or edit) ── */
function TierForm({ projectId, editing, onDone }) {
  const { t } = useTranslation()
  const [features,    setFeatures]    = useState(editing?.features || [])
  const [featureInput, setFeatureInput] = useState('')
  const [formError,   setFormError]   = useState(null)

  const createTierMutation = useCreateProjectTier()
  const updateTierMutation = useUpdateProjectTier()
  const isLoading = createTierMutation.isPending || updateTierMutation.isPending

  const addFeature = () => {
    const val = featureInput.trim()
    if (val && !features.includes(val)) setFeatures((f) => [...f, val])
    setFeatureInput('')
  }

  const removeFeature = (f) => setFeatures((prev) => prev.filter((x) => x !== f))

  const initial = {
    name:        editing?.name        || '',
    amount:      editing?.amount      ?? '',
    currency:    editing?.currency    || 'RWF',
    description: editing?.description || '',
    isActive:    editing?.isActive    ?? true,
  }

  const handleSubmit = async (values) => {
    setFormError(null)
    try {
      if (editing) {
        await updateTierMutation.mutateAsync({ projectId, tierId: editing.id, ...values, features })
      } else {
        await createTierMutation.mutateAsync({ projectId, ...values, features })
      }
      onDone()
    } catch (err) {
      setFormError(err?.data?.message || t('dash.manage.error_generic', { defaultValue: 'Something went wrong' }))
    }
  }

  return (
    <div className="rounded-2xl border p-4 space-y-3"
      style={{ borderColor: 'var(--color-riec-orange)', background: 'rgba(238,122,24,0.03)' }}>
      <Formik initialValues={initial} validationSchema={tierSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FField name="name" label={t('dash.manage.tier_name', { defaultValue: 'Name' })} required>
                <Field name="name" placeholder="e.g. Basic Plan" className={inputCls} />
              </FField>
              <FField name="currency" label={t('dash.manage.tier_currency', { defaultValue: 'Currency' })} required>
                <Field as="select" name="currency" className={selectCls}>
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Field>
              </FField>
            </div>

            <FField name="amount" label={t('dash.manage.tier_price', { defaultValue: 'Price' })} required>
              <div className="flex items-center gap-2">
                <span className="rounded-xl border px-3 py-2.5 text-xs font-semibold flex-shrink-0"
                  style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-2)', color: 'var(--color-body-color)' }}>
                  {values.currency}
                </span>
                <Field name="amount" type="number" min="0" placeholder="0" className={inputCls} />
              </div>
            </FField>

            <FField name="description" label={t('dash.manage.tier_description', { defaultValue: 'Description (optional)' })}>
              <RichEditor
                value={values.description}
                onChange={(html) => setFieldValue('description', html)}
                placeholder="What's included…"
                minHeight={64}
              />
            </FField>

            {/* Features */}
            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-body-color)' }}>
                {t('dash.manage.tier_features', { defaultValue: 'Features' })}
              </label>
              <div className="flex gap-2 mb-2">
                <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  placeholder={t('dash.manage.feature_placeholder', { defaultValue: 'Add a feature…' })}
                  className={inputCls} />
                <button type="button" onClick={addFeature}
                  className="flex-shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-white transition-colors"
                  style={{ background: 'var(--color-riec-orange)' }}>
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              {features.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {features.map((f) => (
                    <span key={f} className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: 'rgba(19,194,150,0.10)', color: 'var(--color-secondary)' }}>
                      {f}
                      <button type="button" onClick={() => removeFeature(f)}
                        className="ml-0.5 rounded-full transition-colors hover:text-red-500">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* isActive toggle */}
            <label className="flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--color-gray-1)]"
              style={{ borderColor: 'var(--color-stroke)' }}>
              <div className="relative h-5 w-9 rounded-full transition-colors flex-shrink-0"
                style={{ background: values.isActive ? 'var(--color-secondary)' : 'var(--color-dark-7)' }}>
                <div className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform"
                  style={{ transform: values.isActive ? 'translateX(16px)' : 'translateX(2px)' }} />
              </div>
              <input type="checkbox" className="sr-only" checked={values.isActive}
                onChange={(e) => setFieldValue('isActive', e.target.checked)} />
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                  {t('dash.manage.tier_active', { defaultValue: 'Active' })}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>
                  {t('dash.manage.tier_active_desc', { defaultValue: 'Make this tier available for purchase' })}
                </p>
              </div>
            </label>

            {formError && (
              <p className="text-[10px]" style={{ color: 'var(--color-riec-red)' }}>{formError}</p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={onDone}
                className="rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[var(--color-gray-1)]"
                style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}>
                {t('dash.manage.cancel', { defaultValue: 'Cancel' })}
              </button>
              <button type="submit" disabled={isLoading}
                className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white disabled:opacity-60 transition-colors"
                style={{ background: 'var(--color-secondary)', boxShadow: '0 4px 12px rgba(19,194,150,0.30)' }}>
                <Check className="h-3.5 w-3.5" />
                {isLoading
                  ? t('dash.manage.saving', { defaultValue: 'Saving…' })
                  : editing
                    ? t('dash.manage.update', { defaultValue: 'Update' })
                    : t('dash.manage.create', { defaultValue: 'Create' })}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default function TiersPanel({ projectId }) {
  const { t } = useTranslation()
  const { data: tiers = [], isLoading } = useGetProjectTiers({ projectId })
  const deleteTierMutation = useDeleteProjectTier()

  const [formMode, setFormMode] = useState(null) // null | 'create' | tier-object

  const handleDelete = async (tierId) => {
    if (!window.confirm(t('dash.manage.confirm_delete_tier', { defaultValue: 'Delete this tier?' }))) return
    await deleteTierMutation.mutateAsync({ projectId, tierId })
  }

  const deleting = deleteTierMutation.isPending

  return (
    <div className="space-y-3">

      {isLoading && (
        <p className="text-xs text-center py-6" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.loading', { defaultValue: 'Loading…' })}
        </p>
      )}

      {/* Tier cards */}
      {tiers.map((tier) => (
        <div key={tier.id}>
          <div className="rounded-2xl border bg-white p-4"
            style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-1)' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>{tier.name}</p>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={tier.isActive
                      ? { background: 'rgba(19,194,150,0.12)', color: 'var(--color-secondary)' }
                      : { background: 'var(--color-gray-2)', color: 'var(--color-body-color)' }}>
                    {tier.isActive
                      ? t('dash.manage.active',   { defaultValue: 'Active' })
                      : t('dash.manage.inactive', { defaultValue: 'Inactive' })}
                  </span>
                </div>
                {tier.description && (
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-body-color)' }}>{tier.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <p className="text-sm font-bold" style={{ color: 'var(--color-riec-orange)' }}>
                  {formatPrice(tier.amount, tier.currency)}
                </p>
                <button onClick={() => setFormMode(formMode?.id === tier.id ? null : tier)}
                  className="rounded-lg p-1.5 transition-colors"
                  style={{ color: 'var(--color-dark-6)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(30,154,224,0.10)'; e.currentTarget.style.color = 'var(--color-my-blue)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-dark-6)' }}>
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(tier.id)} disabled={deleting}
                  className="rounded-lg p-1.5 transition-colors disabled:opacity-40"
                  style={{ color: 'var(--color-dark-6)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(225,27,37,0.10)'; e.currentTarget.style.color = 'var(--color-riec-red)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-dark-6)' }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Features */}
            {tier.features?.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {tier.features.map((f) => (
                  <span key={f} className="rounded-full px-2 py-0.5 text-[10px]"
                    style={{ background: 'var(--color-gray-2)', color: 'var(--color-body-color)' }}>
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Inline edit form anchored below this card */}
          {formMode?.id === tier.id && (
            <div className="mt-2">
              <TierForm projectId={projectId} editing={tier} onDone={() => setFormMode(null)} />
            </div>
          )}
        </div>
      ))}

      {!isLoading && tiers.length === 0 && (
        <p className="text-xs text-center py-4" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.manage.no_tiers', { defaultValue: 'No tiers yet.' })}
        </p>
      )}

      {/* Add tier */}
      {formMode === 'create' ? (
        <TierForm projectId={projectId} editing={null} onDone={() => setFormMode(null)} />
      ) : (
        <button onClick={() => setFormMode('create')}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 text-xs font-semibold transition-colors"
          style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-riec-orange)'; e.currentTarget.style.color = 'var(--color-riec-orange)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-stroke)'; e.currentTarget.style.color = 'var(--color-body-color)' }}
        >
          <Plus className="h-3.5 w-3.5" />
          {t('dash.manage.add_tier', { defaultValue: 'Add Tier' })}
        </button>
      )}
    </div>
  )
}
