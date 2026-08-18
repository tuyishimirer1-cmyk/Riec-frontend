import * as Yup from 'yup'

export const step1Schema = Yup.object({
  title:       Yup.string().min(3, 'Min 3 chars').required('Title is required'),
  description: Yup.string().min(10, 'Min 10 chars').required('Description is required'),
  location:    Yup.string().required('Location is required'),
  youtubeVideoUrl: Yup.string().url('Invalid URL').nullable(),
})

export const step2Schema = Yup.object({
  type:        Yup.string().required('Type is required'),
  category:    Yup.string().required('Category is required'),
})

export const step3Schema = Yup.object({
  featured:    Yup.boolean(),
  purchasable: Yup.boolean(),
})

export const STEPS = [
  { labelKey: 'dash.wizard.step_basic',    schema: step1Schema },
  { labelKey: 'dash.wizard.step_details',  schema: step2Schema },
  { labelKey: 'dash.wizard.step_settings', schema: step3Schema },
  { labelKey: 'dash.wizard.step_media',    schema: Yup.object() },
]

export const EMPTY = {
  title: '', description: '', location: '',
  type: '', category: '',
  featured: false, purchasable: false,
  youtubeVideoUrl: '',
  basePrice: '',
  currency: 'USD',
}

export const TYPES      = ['COMPLETED']

export const DOCUMENT_TYPES = [
  'PRESENTATION', 'PERSPECTIVE', 'SITE_PLAN',
  'ARCHITECTURAL_DRAWINGS', 'STRUCTURAL_DRAWINGS', 'MEP_DRAWINGS',
  'GEOTECHNICAL_REPORT', 'TOPOGRAPHICAL_SURVEY', 'BILL_OF_QUANTITIES',
  'BUDGET_ESTIMATE', 'ENVIRONMENTAL_IMPACT_ASSESSMENT', 'CONSTRUCTION_PERMIT',
  'LAND_TITLE', 'SOIL_TEST_REPORT', 'MATERIAL_SPECIFICATIONS',
  'TENDER_DOCUMENT', 'CONTRACT_AGREEMENT', 'PROJECT_SCHEDULE',
  'METHOD_STATEMENT', 'QUALITY_CONTROL_PLAN', 'HEALTH_SAFETY_PLAN',
]
export const CATEGORIES = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL']

export const inputCls  = [
  'w-full rounded-xl border px-3 py-2.5 text-xs placeholder:text-[var(--color-dark-6)]',
  'focus:outline-none transition-colors',
  'bg-[var(--color-gray-1)] text-[var(--color-primary)]',
  'border-[var(--color-stroke)] focus:border-[var(--color-riec-orange)] focus:bg-white',
].join(' ')

export const selectCls = inputCls + ' cursor-pointer'
