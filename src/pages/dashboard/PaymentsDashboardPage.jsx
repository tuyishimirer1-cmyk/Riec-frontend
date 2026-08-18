import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateCheckout } from '../../react-query'
import CheckoutForm   from './Payment/CheckoutForm'
import DownloadsPanel from './Payment/DownloadsPanel'

export default function PaymentsDashboardPage() {
  const { t }       = useTranslation()
  const [checkoutUrl, setCheckoutUrl] = useState(null)
  const [status, setStatus] = useState('idle')

  const initCheckoutMutation = useCreateCheckout()

  const handleSubmit = async (data) => {
    setStatus('loading')
    try {
      const result = await initCheckoutMutation.mutateAsync(data)
      setCheckoutUrl(result?.checkoutUrl || result?.url)
      setStatus('succeeded')
    } catch {
      setStatus('failed')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
          {t('dash.payments_page.title', { defaultValue: 'Payments' })}
        </h2>
        <p className="text-xs" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.payments_page.subtitle', { defaultValue: 'Manage checkout and download tokens' })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CheckoutForm
          onSubmit={handleSubmit}
          checkoutUrl={checkoutUrl}
          isLoading={status === 'loading'}
        />
        <DownloadsPanel />
      </div>
    </div>
  )
}