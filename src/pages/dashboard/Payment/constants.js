import * as Yup from 'yup'

export const checkoutSchema = Yup.object({
  projectId: Yup.string().required('Project ID is required'),
  tierId:    Yup.string().required('Tier ID is required'),
  email:     Yup.string().email('Invalid email').required('Email is required'),
  fullName:  Yup.string().min(2).required('Full name is required'),
})

export const CHECKOUT_EMPTY = { projectId: '', tierId: '', email: '', fullName: '' }

export const inputCls = [
  'w-full rounded-xl border px-3 py-2.5 text-xs placeholder:text-[var(--color-dark-6)]',
  'focus:outline-none transition-colors',
  'bg-[var(--color-gray-1)] text-[var(--color-primary)]',
  'border-[var(--color-stroke)] focus:border-[var(--color-riec-orange)] focus:bg-white',
].join(' ')
