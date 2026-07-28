import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { STEPS } from './constants'

export default function StepBar({ current }) {
  const { t } = useTranslation()

  return (
    <div className="mb-7">
      {/* Circles + connectors */}
      <div className="flex items-center">
        {STEPS.map((step, i) => {
          const done    = i < current
          const active  = i === current
          const pending = i > current

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              {/* Circle */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300"
                  style={
                    done    ? { background: 'var(--color-secondary)', color: '#fff', boxShadow: '0 2px 8px rgba(19,194,150,0.40)' }
                    : active ? { background: 'var(--color-riec-orange)', color: '#fff', boxShadow: '0 2px 12px rgba(238,122,24,0.50)', transform: 'scale(1.15)' }
                    :          { background: 'var(--color-gray-2)', color: 'var(--color-dark-6)' }
                  }
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-2 h-0.5 rounded-full overflow-hidden"
                  style={{ background: 'var(--color-gray-2)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: done ? '100%' : '0%',
                      background: 'var(--color-secondary)',
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Labels row */}
      <div className="flex mt-2">
        {STEPS.map((step, i) => {
          const active = i === current
          const done   = i < current
          // Each label sits under its circle; last one has no flex-1 connector after it
          return (
            <div key={i} className="flex flex-1 last:flex-none">
              <span
                className="text-[10px] font-semibold whitespace-nowrap transition-colors duration-200"
                style={{
                  color: active ? 'var(--color-riec-orange)'
                       : done   ? 'var(--color-secondary)'
                       :          'var(--color-dark-6)',
                }}
              >
                {t(step.labelKey, { defaultValue: step.labelKey.split('.').pop() })}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
