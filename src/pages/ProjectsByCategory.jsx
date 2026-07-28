import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, FolderOpen } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGetProjectsByCategory } from '../react-query'
import EnhancedProjectCard from '../components/page_elements/Projects/EnhancedProjectCard'
import SearchBar from '../components/ui/SearchBar'

gsap.registerPlugin(ScrollTrigger)

const CATEGORY_LABELS = {
  RESIDENTIAL: 'Residential',
  COMMERCIAL:  'Commercial',
  INDUSTRIAL:  'Industrial',
}

export default function ProjectsByCategory() {
  const { category }  = useParams()
  const navigate      = useNavigate()
  const [page, setPage]       = useState(1)
  const [pageSize]            = useState(9)
  const [search, setSearch]   = useState('')

  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const gridRef    = useRef(null)

  const { data, isFetching } = useGetProjectsByCategory(category?.toUpperCase())

  const items      = data?.items || []
  const total      = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const filtered = search.trim().length >= 2
    ? items.filter((p) => p.title?.toLowerCase().includes(search.toLowerCase()))
    : items

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [category])

  useEffect(() => {
    if (!gridRef.current || isFetching) return
    const cards = gridRef.current.children
    if (cards.length) {
      gsap.fromTo(cards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      )
    }
  }, [filtered, isFetching])

  const label = CATEGORY_LABELS[category?.toUpperCase()] || category

  return (
    <>
      <Helmet>
        <title>{label} Projects | R.I.E.C</title>
        <meta name="description" content={`Browse all ${label} projects by R.I.E.C`} />
      </Helmet>

      <section ref={sectionRef} className="min-h-screen bg-riec-dark pb-24 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">

          {/* Hero */}
          <div className="pt-16 pb-10 border-b border-slate-800">
            <button
              onClick={() => navigate('/projects')}
              className="mb-6 flex items-center gap-2 text-slate-400 transition-colors duration-200"
              onMouseEnter={(e) => e.currentTarget.style.color = '#EE7A18'}
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">All Projects</span>
            </button>

            <div ref={titleRef} className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl flex-shrink-0"
                style={{ background: 'rgba(238,122,24,0.12)', color: '#EE7A18' }}>
                <FolderOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-riec-orange font-bold text-xs uppercase tracking-widest mb-1">
                  Completed Projects
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {label}
                </h1>
              </div>
              <span className="ml-auto text-2xl font-bold text-slate-500">{total}</span>
            </div>
          </div>

          {/* Search + filters */}
          <div className="py-6">
            <SearchBar
              dark
              value={search}
              onChange={(q) => { setPage(1); setSearch(q) }}
              placeholder={`Search ${label} projects…`}
              className="max-w-sm"
            />
          </div>

          {/* Grid */}
          {isFetching ? (
            <div className="flex justify-center py-24">
              <div className="w-10 h-10 border-4 border-riec-orange border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <FolderOpen className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-sm">No projects found{search ? ` for "${search}"` : ''}.</p>
            </div>
          ) : (
            <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filtered.map((project, index) => (
                <EnhancedProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isFetching && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Previous
              </button>
              <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
