import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Briefcase, MapPin, Building2, Clock3 } from 'lucide-react'
import { useGetCareers } from '../react-query'

export default function Careers() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ location: '', department: '', type: '' })

  const { data, isLoading, isFetching } = useGetCareers({
    page,
    limit: 9,
    published: true,  // Only show published jobs on public careers page
    location: filters.location || undefined,
    department: filters.department || undefined,
    type: filters.type || undefined,
  })

  const jobs = data?.items || []
  const totalPages = data?.totalPages || 1

  return (
    <>
      <Helmet>
        <title>Careers | R.I.E.C</title>
        <meta
          name="description"
          content="Explore open roles at R.I.E.C and apply for positions in engineering, design, and project delivery."
        />
      </Helmet>

      <main className="min-h-screen bg-riec-dark pb-16 pt-28 text-white">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800/70 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
            <p className="text-xs uppercase tracking-[0.24em] text-riec-orange">Join our team</p>
            <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">Build the next generation of infrastructure with us</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              We are hiring across surveying, engineering, architecture, and project execution. Find a role that matches your strengths.
            </p>
          </div>

          <div className="mt-6 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:grid-cols-3">
            <input
              value={filters.department}
              onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, department: e.target.value })) }}
              placeholder="Department"
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
            />
            <input
              value={filters.location}
              onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, location: e.target.value })) }}
              placeholder="Location"
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
            />
            <input
              value={filters.type}
              onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, type: e.target.value })) }}
              placeholder="Employment type"
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
            />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Open positions</h2>
            <span className="text-xs text-slate-400">
              {isFetching ? 'Refreshing...' : `${data?.total || jobs.length} roles`}
            </span>
          </div>

          {isLoading ? (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center text-sm text-slate-400">
              Loading open roles...
            </div>
          ) : jobs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center text-sm text-slate-400">
              No roles match your current filters.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-riec-orange/50 hover:shadow-[0_18px_50px_rgba(248,113,22,0.16)]"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-riec-orange/15 text-riec-orange">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <h3 className="line-clamp-2 text-lg font-bold">{job.title}</h3>

                  <div className="mt-4 space-y-2 text-xs text-slate-300">
                    <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-slate-500" /> {job.location || 'Location not specified'}</p>
                    <p className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-slate-500" /> {job.department || 'General'}</p>
                    <p className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-slate-500" /> {job.employmentType || 'Full-time'}</p>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm text-slate-400">{job.description}</p>

                  <Link
                    to={`/careers/${job.slug || job.id}`}
                    className="mt-5 inline-flex items-center rounded-full bg-riec-orange px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-riec-orange-light"
                  >
                    View role / Apply
                  </Link>
                </article>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1 || isFetching}
              className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages || isFetching}
              className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </>
  )
}
