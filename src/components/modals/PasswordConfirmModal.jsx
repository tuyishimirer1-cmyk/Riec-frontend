import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { X, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import PropTypes from 'prop-types'

/**
 * Password Confirmation Modal
 * Requires admin to enter their password before performing sensitive operations
 */
const PasswordConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Please enter your password to confirm this action.',
  actionLabel = 'Confirm',
  danger = false 
}) => {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const modalRef = useRef(null)
  const overlayRef = useRef(null)
  const contentRef = useRef(null)
  const inputRef = useRef(null)

  // Entrance/exit animations
  useEffect(() => {
    const modal = modalRef.current
    const overlay = overlayRef.current
    const content = contentRef.current

    if (!modal || !overlay || !content) return

    const ctx = gsap.context(() => {
      if (isOpen) {
        // Reset states
        gsap.set(overlay, { opacity: 0 })
        gsap.set(modal, { scale: 0.9, opacity: 0 })
        gsap.set(content.children, { y: 20, opacity: 0 })

        // Animate in
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        })

        gsap.to(modal, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: 'back.out(1.7)',
          onComplete: () => {
            gsap.to(content.children, {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.08,
              ease: 'power2.out'
            })
            // Focus input after animation
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }
        })
      } else {
        // Animate out
        gsap.to(content.children, {
          y: -20,
          opacity: 0,
          duration: 0.25,
          stagger: 0.05,
          ease: 'power2.in'
        })

        gsap.to(modal, {
          scale: 0.9,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
          delay: 0.1
        })

        gsap.to(overlay, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
          delay: 0.15
        })
      }
    }, [modalRef, overlayRef, contentRef])

    return () => ctx.revert()
  }, [isOpen])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPassword('')
      setShowPassword(false)
      setError(null)
      setIsSubmitting(false)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isSubmitting, onClose])

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!password.trim()) {
      setError(t('auth.password_required', { defaultValue: 'Password is required' }))
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await onConfirm(password)
      // Success - modal will be closed by parent component
      setPassword('')
    } catch (err) {
      console.error('Password confirmation error:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 
        t('auth.invalid_password', { defaultValue: 'Invalid password. Please try again.' })
      setError(errorMsg)
      setIsSubmitting(false)
      // Focus input for retry
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={isSubmitting ? undefined : onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[60] pointer-events-none">
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
          onClick={e => e.stopPropagation()}
          style={{ boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}
        >
          {/* Header */}
          <div 
            className="px-6 py-5 border-b flex items-center justify-between"
            style={{ 
              borderColor: danger ? 'rgba(225,27,37,0.2)' : 'var(--color-stroke)',
              background: danger ? 'rgba(225,27,37,0.05)' : 'var(--color-gray-1)'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  background: danger ? 'rgba(225,27,37,0.1)' : 'rgba(238,122,24,0.1)'
                }}
              >
                {danger ? (
                  <AlertTriangle className="w-5 h-5" style={{ color: 'var(--color-riec-red)' }} />
                ) : (
                  <Lock className="w-5 h-5" style={{ color: 'var(--color-riec-orange)' }} />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>
                  {title}
                </h3>
                <p className="text-xs" style={{ color: 'var(--color-body-color)' }}>
                  {t('auth.password_confirmation', { defaultValue: 'Password confirmation required' })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-lg transition-colors disabled:opacity-50"
              style={{ color: 'var(--color-body-color)' }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.background = 'var(--color-gray-2)')}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div ref={contentRef} className="p-6 space-y-5">
              {/* Message */}
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-body-color)' }}>
                {message}
              </p>

              {/* Password Input */}
              <div>
                <label 
                  htmlFor="confirm-password" 
                  className="block text-xs font-semibold mb-2"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {t('auth.password', { defaultValue: 'Password' })} *
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError(null)
                    }}
                    disabled={isSubmitting}
                    placeholder={t('auth.enter_password', { defaultValue: 'Enter your password' })}
                    className="w-full px-4 py-3 pr-12 rounded-xl border text-sm transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      borderColor: error ? 'var(--color-riec-red)' : 'var(--color-stroke)',
                      background: isSubmitting ? 'var(--color-gray-1)' : '#fff',
                      color: 'var(--color-primary)'
                    }}
                    onFocus={(e) => !error && (e.target.style.borderColor = 'var(--color-riec-orange)')}
                    onBlur={(e) => !error && (e.target.style.borderColor = 'var(--color-stroke)')}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                    style={{ color: 'var(--color-body-color)' }}
                    onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.background = 'var(--color-gray-1)')}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--color-riec-red)' }}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {error}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl border text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: 'var(--color-stroke)',
                    color: 'var(--color-body-color)'
                  }}
                  onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.background = 'var(--color-gray-1)')}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {t('common.cancel', { defaultValue: 'Cancel' })}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !password.trim()}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: danger ? 'var(--color-riec-red)' : 'var(--color-riec-orange)',
                    boxShadow: danger 
                      ? '0 4px 12px rgba(225,27,37,0.35)' 
                      : '0 4px 12px rgba(238,122,24,0.35)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting && password.trim()) {
                      e.currentTarget.style.background = danger 
                        ? 'rgba(225,27,37,0.9)' 
                        : 'var(--color-riec-orange-light)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = danger 
                      ? 'var(--color-riec-red)' 
                      : 'var(--color-riec-orange)'
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('common.verifying', { defaultValue: 'Verifying...' })}
                    </span>
                  ) : (
                    actionLabel
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

PasswordConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  actionLabel: PropTypes.string,
  danger: PropTypes.bool
}

export default PasswordConfirmModal
