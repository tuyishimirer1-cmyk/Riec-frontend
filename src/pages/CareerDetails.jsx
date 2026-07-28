import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { MapPin, Building2, Clock3, ArrowLeft } from 'lucide-react'
import { useApplyJob, useGetCareer } from '../react-query'

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  coverLetter: '',
  cvUrl: '',
}

export default function CareerDetails() {
  const { careerId } = useParams()
  const { data: job, isLoading } = useGetCareer(careerId)
  const applyMutation = useApplyJob()
  const [form, setForm] = useState(EMPTY_FORM)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!job?.id) return

    if (!form.fullName || !form.email) {
      toast.error('Full name and email are required.')
      return
    }

    try {
      await applyMutation.mutateAsync({
        jobId: job.id,
        ...form,
      })
      toast.success('Application submitted successfully.')
      setForm(EMPTY_FORM)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to submit application.')
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-riec-dark pt-28 text-white">
        <div className="mx-auto max-w-4xl px-4 text-sm text-slate-400">Loading role details...</div>
      </main>
    )
  }

  if (!job?.id) {
    return (
      <main className="min-h-screen bg-riec-dark pt-28 text-white">
        <div className="mx-auto max-w-4xl px-4">
          <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">Role not found or no longer published.</p>
          <Link to="/careers" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-riec-orange hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to careers
          </Link>
        </div>
      </main>
    )
  }

  return (
    <>
      <Helmet>
        <title>{job.title} | Careers | R.I.E.C</title>
        <meta name="description" content={job.description || 'Career opportunity at R.I.E.C'} />
      </Helmet>

      <main className="min-h-screen bg-riec-dark pb-16 pt-28 text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[1.2fr_1fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <Link to="/careers" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-riec-orange">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to careers
            </Link>

            <h1 className="text-3xl font-black leading-tight">{job.title}</h1>

            <div className="mt-5 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500" /> {job.location || 'Location not specified'}</p>
              <p className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-500" /> {job.department || 'General'}</p>
              <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-slate-500" /> {job.employmentType || 'Full-time'}</p>
            </div>

            <div className="mt-7 space-y-6 text-sm leading-7 text-slate-200">
              <section>
                <h2 className="mb-2 text-lg font-bold text-white">About this role</h2>
                <p className="whitespace-pre-line text-slate-300">{job.description}</p>
              </section>

              {job.requirements && (
                <section>
                  <h2 className="mb-2 text-lg font-bold text-white">Requirements</h2>
                  <p className="whitespace-pre-line text-slate-300">{job.requirements}</p>
                </section>
              )}

              {job.responsibilities && (
                <section>
                  <h2 className="mb-2 text-lg font-bold text-white">Responsibilities</h2>
                  <p className="whitespace-pre-line text-slate-300">{job.responsibilities}</p>
                </section>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-xl font-bold">Apply for this role</h2>
            <p className="mt-1 text-xs text-slate-400">Submit your details and our team will review your application.</p>

            <form className="mt-5 space-y-3" onSubmit={onSubmit}>
              <input
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                placeholder="Full name"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
                required
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
                required
              />
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="Phone (optional)"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
              />
              <input
                name="cvUrl"
                value={form.cvUrl}
                onChange={onChange}
                placeholder="CV URL (optional)"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
              />
              <textarea
                name="coverLetter"
                value={form.coverLetter}
                onChange={onChange}
                rows={5}
                placeholder="Cover letter (optional)"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
              />

              <button
                type="submit"
                disabled={applyMutation.isPending}
                className="w-full rounded-full bg-riec-orange px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-riec-orange-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                {applyMutation.isPending ? 'Submitting...' : 'Submit application'}
              </button>
            </form>
          </aside>
        </div>
      </main>
    </>
  )
}
