import * as Yup from 'yup'

export const careerSchema = Yup.object({
  title:            Yup.string().min(3).required('Title is required'),
  department:       Yup.string().required('Department is required'),
  location:         Yup.string().required('Location is required'),
  employmentType:   Yup.string().required('Employment type is required'),
  description:      Yup.string().min(10, 'Min 10 chars').required('Description is required'),
  requirements:     Yup.string().min(10, 'Min 10 chars').required('Requirements are required'),
  responsibilities: Yup.string().min(10, 'Min 10 chars').required('Responsibilities are required'),
})

export const CAREER_EMPTY = {
  title: '', department: '', location: '', employmentType: '',
  description: '', requirements: '', responsibilities: '',
}

export const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']

export const inputCls = [
  'w-full rounded-xl border px-3 py-2.5 text-xs placeholder:text-[var(--color-dark-6)]',
  'focus:outline-none transition-colors',
  'bg-[var(--color-gray-1)] text-[var(--color-primary)]',
  'border-[var(--color-stroke)] focus:border-[var(--color-riec-orange)] focus:bg-white',
].join(' ')
