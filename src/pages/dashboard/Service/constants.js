import * as Yup from 'yup'

const taskSchema = Yup.object({
  title:       Yup.string().required('Task title is required'),
  description: Yup.string().required('Task description is required'),
})

export const serviceSchema = Yup.object({
  name:                Yup.string().min(3).required('Name is required'),
  shortDescription:    Yup.string().min(10, 'Min 10 chars').required('Short description is required'),
  detailedDescription: Yup.string(),
  order:               Yup.number().min(0).integer(),
  title:               Yup.string(),
  description:         Yup.string(),
  process:             Yup.string(),
  mainTasks:           Yup.array().of(taskSchema),
})

export const SERVICE_EMPTY = {
  name:                '',
  shortDescription:    '',
  detailedDescription: '',
  order:               0,
  title:               '',
  description:         '',
  process:             '',
  mainTasks:           [],
}

export const inputCls = [
  'w-full rounded-xl border px-3 py-2.5 text-xs placeholder:text-[var(--color-dark-6)]',
  'focus:outline-none transition-colors',
  'bg-[var(--color-gray-1)] text-[var(--color-primary)]',
  'border-[var(--color-stroke)] focus:border-[var(--color-riec-orange)] focus:bg-white',
].join(' ')
