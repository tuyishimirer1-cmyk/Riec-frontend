import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, SlidersHorizontal, MapPin } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGetProjects, useSearchProjects } from '../react-query'
import EnhancedProjectCard from '../components/page_elements/Projects/EnhancedProjectCard'
import SearchBar from '../components/ui/SearchBar'

gsap.registerPlugin(ScrollTrigger)

function Projects() {
  const { t } = useTranslation()

  const [search, setSearch] = useState('')
  const [type, setType] = useState('COMPLETED')
  const [category, setCategory] = useState('all')
  const [location, setLocation] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  const isSearching = search.trim().length >= 2

  const { isFetching: listFetching, data: projectsData } = useGetProjects(
    { page, limit: pageSize, type, ...(category !== 'all' && { category }), ...(location && { location }) }
  )
  const { data: searchData, isFetching: searchFetching } = useSearchProjects(
    search, { type, ...(category !== 'all' && { category }), ...(location && { location }), page, limit: pageSize }
  )

  const isFetching = isSearching ? searchFetching : listFetching
  const allProjects = isSearching ? (searchData?.data || []) : (projectsData?.items || [])
  const meta = isSearching
    ? { total: searchData?.total || 0, page: searchData?.meta?.page || 1, totalPages: searchData?.meta?.totalPages }
    : { total: projectsData?.total || 0, page: projectsData?.page || 1, totalPages: projectsData?.totalPages }

  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.2 })
      gsap.fromTo(descRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power2.out' })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' })
    }
  }, [allProjects])

  const totalPages = meta.totalPages ?? Math.max(1, Math.ceil((meta.total || allProjects.length || 1) / pageSize))

  return (
    <>
      <Helmet>
        <title>{t('projects.page_title')} | R.I.E.C</title>
        <meta name="description" content={t('projects.page_description')} />
      </Helmet>

      <section ref={sectionRef} className="pt-32 pb-24 px-6 sm:px-8 md:px-10 lg:px-12 bg-riec-dark min-h-screen">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-8">
            <p className="text-riec-orange font-bold text-sm uppercase tracking-wider mb-4">{t('projects.tag')}</p>
            <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6">{t('projects.title')}</h1>
            <p ref={descRef} className="text-gray-300 text-lg max-w-3xl">{t('projects.description')}</p>
          </div>

          <div className="mb-10 pb-6 border-b border-gray-700">
            <div className="flex flex-col gap-4 rounded-2xl bg-white/5 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.5)] backdrop-blur">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <SearchBar
                    dark
                    value={search}
                    onChange={(q) => { setPage(1); setSearch(q) }}
                    onSelect={(item) => { setPage(1); setSearch(item.text) }}
                    placeholder={t('projects.search_placeholder')}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-1 flex-wrap gap-3 justify-end">
                  <select value={type} onChange={(e) => { setPage(1); setType(e.target.value) }} className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 focus:border-riec-orange focus:outline-none">
                    <option value="COMPLETED">{t('projects.type.completed')}</option>
                    <option value="PLAN_TO_BUY">{t('projects.type.plan_to_buy')}</option>
                  </select>
                  <select value={category} onChange={(e) => { setPage(1); setCategory(e.target.value) }} className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 focus:border-riec-orange focus:outline-none">
                    <option value="all">{t('projects.filters.all')}</option>
                    <option value="RESIDENTIAL">{t('projects.filters.residential')}</option>
                    <option value="COMMERCIAL">{t('projects.filters.commercial')}</option>
                    <option value="INDUSTRIAL">{t('projects.filters.industrial')}</option>
                  </select>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => { setPage(1); setLocation(e.target.value) }}
                      placeholder={t('projects.location_placeholder')}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/70 py-2.5 pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="h-3 w-3" />
                  <span>{t('projects.filter_hint')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {allProjects.map((project, index) => (
              <EnhancedProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || isFetching} className="rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors">
              {t('projects.prev')}
            </button>
            <span className="text-xs text-slate-400">{t('projects.page_of', { page, totalPages })}</span>
            <button type="button" onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))} disabled={page >= totalPages || isFetching} className="rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors">
              {t('projects.next')}
            </button>
            <select className="ml-4 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100" value={pageSize} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)) }}>
              {[8, 12, 16].map((size) => <option key={size} value={size}>{size} / page</option>)}
            </select>
          </div>
        </div>
      </section>
    </>
  )
}

export default Projects
