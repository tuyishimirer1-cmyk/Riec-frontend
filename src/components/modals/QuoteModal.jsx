import { useState } from 'react'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'
import { useCreateQuote } from '../../react-query'

const steps = ['Project', 'Scope', 'Contact', 'Review']

const QuoteModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const createQuoteMutation = useCreateQuote()
  const [form, setForm] = useState({
    projectType: '',
    location: '',
    timeline: '',
    budgetRange: '',
    servicesNeeded: '',
    size: '',
    floors: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  })

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const canNext = () => {
    if (step === 0) {
      return form.projectType && form.location
    }
    if (step === 1) {
      return form.budgetRange && form.servicesNeeded
    }
    if (step === 2) {
      return form.name && form.email
    }
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await createQuoteMutation.mutateAsync(form)
      toast.success('Your request has been sent. We will get back to you soon.')
      setForm({
        projectType: '',
        location: '',
        timeline: '',
        budgetRange: '',
        servicesNeeded: '',
        size: '',
        floors: '',
        name: '',
        email: '',
        phone: '',
        company: '',
        notes: '',
      })
      setStep(0)
      onClose()
    } catch (err) {
      toast.error('Could not send your request. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Tell us about your project
          </h2>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Project type
            </label>
            <input
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
              placeholder="New build, renovation, interior design…"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City / area"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Desired timeline
              </label>
              <input
                name="timeline"
                value={form.timeline}
                onChange={handleChange}
                placeholder="e.g. Q3 2026"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
              />
            </div>
          </div>
        </div>
      )
    }

    if (step === 1) {
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Scope & budget
          </h2>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Budget range
            </label>
            <input
              name="budgetRange"
              value={form.budgetRange}
              onChange={handleChange}
              placeholder="e.g. $100k – $250k"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Services needed
            </label>
            <textarea
              name="servicesNeeded"
              value={form.servicesNeeded}
              onChange={handleChange}
              rows={3}
              placeholder="Surveying, architecture, construction supervision…"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Approximate size (m²)
              </label>
              <input
                name="size"
                value={form.size}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Number of floors
              </label>
              <input
                name="floors"
                value={form.floors}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
              />
            </div>
          </div>
        </div>
      )
    }

    if (step === 2) {
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-100">
            How can we contact you?
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Full name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Company (optional)
              </label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Phone (optional)
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Additional notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
            />
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4 text-sm text-slate-100">
        <h2 className="text-lg font-semibold text-slate-100">
          Review your request
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1 text-slate-300">
            <p className="font-semibold text-slate-100">Project</p>
            <p>Type: {form.projectType}</p>
            <p>Location: {form.location}</p>
            <p>Timeline: {form.timeline}</p>
          </div>
          <div className="space-y-1 text-slate-300">
            <p className="font-semibold text-slate-100">Scope</p>
            <p>Budget: {form.budgetRange}</p>
            <p>Services: {form.servicesNeeded}</p>
            <p>Size/Floors: {form.size} m² / {form.floors}</p>
          </div>
        </div>
        <div className="space-y-1 text-slate-300">
          <p className="font-semibold text-slate-100">Contact</p>
          <p>
            {form.name} {form.company && `• ${form.company}`}
          </p>
          <p>{form.email}</p>
          {form.phone && <p>{form.phone}</p>}
        </div>
        {form.notes && (
          <div className="space-y-1 text-slate-300">
            <p className="font-semibold text-slate-100">Notes</p>
            <p>{form.notes}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900/95 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.8)] backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Custom plan request
            </p>
            <h1 className="text-xl font-semibold text-white">
              Tell us about your project
            </h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 flex items-center gap-2">
          {steps.map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  index <= step
                    ? 'bg-riec-orange text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="h-px w-6 bg-slate-700" />
              )}
            </div>
          ))}
        </div>

        <div className="mb-6">{renderStep()}</div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => (step > 0 ? setStep((s) => s - 1) : onClose())}
            className="rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-800"
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          <div className="flex items-center gap-2">
            {step < steps.length - 1 && (
              <button
                type="button"
                disabled={!canNext()}
                onClick={() => canNext() && setStep((s) => s + 1)}
                className="rounded-full bg-riec-orange px-5 py-2 text-xs font-semibold text-white shadow-[0_12px_35px_rgba(248,113,22,0.45)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-riec-orange-light"
              >
                Next
              </button>
            )}
            {step === steps.length - 1 && (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="rounded-full bg-riec-orange px-5 py-2 text-xs font-semibold text-white shadow-[0_12px_35px_rgba(248,113,22,0.45)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-riec-orange-light"
              >
                {submitting ? 'Sending…' : 'Submit request'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

QuoteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default QuoteModal

