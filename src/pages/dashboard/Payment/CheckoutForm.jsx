import { useTranslation } from 'react-i18next'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { CreditCard, ExternalLink } from 'lucide-react'
import { checkoutSchema, CHECKOUT_EMPTY, inputCls } from './constants'

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

export default function CheckoutForm({ onSubmit, checkoutUrl, isLoading }) {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl bg-white border p-5"
      style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-1)' }}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: 'rgba(238,122,24,0.10)', color: 'var(--color-riec-orange)' }}>
          <CreditCard className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
            {t('dash.payments_page.checkout_title', { defaultValue: 'Initiate Checkout' })}
          </p>
          <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>
            {t('dash.payments_page.checkout_sub', { defaultValue: 'Trigger a project plan purchase' })}
          </p>
        </div>
      </div>

      <Formik
        initialValues={CHECKOUT_EMPTY}
        validationSchema={checkoutSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await onSubmit(values)
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FField name="projectId" label={t('dash.payments_page.field_project_id', { defaultValue: 'Project ID' })} required>
                <Field name="projectId" placeholder="project-id" className={inputCls} />
              </FField>
              <FField name="tierId" label={t('dash.payments_page.field_tier_id', { defaultValue: 'Tier ID' })} required>
                <Field name="tierId" placeholder="tier-id" className={inputCls} />
              </FField>
            </div>
            <FField name="fullName" label={t('dash.payments_page.field_name', { defaultValue: 'Full Name' })} required>
              <Field name="fullName" placeholder="John Doe" className={inputCls} />
            </FField>
            <FField name="email" label={t('dash.payments_page.field_email', { defaultValue: 'Email' })} required>
              <Field name="email" type="email" placeholder="john@example.com" className={inputCls} />
            </FField>
            <button type="submit" disabled={isSubmitting || isLoading}
              className="w-full rounded-xl py-2.5 text-xs font-bold text-white disabled:opacity-60 transition-colors"
              style={{ background: 'var(--color-riec-orange)', boxShadow: '0 4px 12px rgba(238,122,24,0.30)' }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'var(--color-riec-orange-light)')}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-riec-orange)'}
            >
              {isSubmitting || isLoading
                ? t('dash.payments_page.processing', { defaultValue: 'Processing…' })
                : t('dash.payments_page.start_btn',  { defaultValue: 'Start Checkout' })}
            </button>
          </Form>
        )}
      </Formik>

      {checkoutUrl && (
        <a href={checkoutUrl} target="_blank" rel="noreferrer"
          className="mt-3 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors"
          style={{ borderColor: 'var(--color-secondary)', background: 'rgba(19,194,150,0.06)', color: 'var(--color-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(19,194,150,0.12)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(19,194,150,0.06)'}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t('dash.payments_page.open_url', { defaultValue: 'Open Checkout URL' })}
        </a>
      )}
    </div>
  )
}
