import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Search, Loader2, FolderOpen, Wrench, Briefcase } from 'lucide-react'
import gsap from 'gsap'
import { useSearch } from '../../react-query'

const TABS = [
  { key: 'all',      label: 'All' },
  { key: 'projects', label: 'Projects', icon: FolderOpen },
  { key: 'services', label: 'Services', icon: Wrench },
  { key: 'jobs',     label: 'Jobs',     icon: Briefcase },
]

function ResultItem({ item, type, onClick }) {
  const subtitles = {
    project: item.location || item.category,
    service: item.shortDescription,
    job:     item.department || item.location,
  }
  return (
    <button onClick={onClick}
      className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
        style={{ background: 'rgba(238,122,24,0.12)', color: '#EE7A18' }}>
        {type === 'project' && <FolderOpen className="h-3.5 w-3.5" />}
        {type === 'service' && <Wrench     className="h-3.5 w-3.5" />}
        {type === 'job'     && <Briefcase  className="h-3.5 w-3.5" />}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white truncate">
          {item.title || item.name}
        </p>
        {subtitles[type] && (
          <p className="text-[11px] text-slate-400 truncate">{subtitles[type]}</p>
        )}
      </div>
      <span className="ml-auto flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-700 text-slate-400 capitalize">
        {type}
      </span>
    </button>
  )
}

export default function GlobalSearchModal({ onClose }) {
  const navigate   = useNavigate()
  const overlayRef = useRef(null)
  const panelRef   = useRef(null)
  const inputRef   = useRef(null)

  const [localQ, setLocalQ] = useState('')
  const [tab,    setTab]    = useState('all')
  const [debouncedQ, setDebouncedQ] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(localQ), 350)
    return () => clearTimeout(t)
  }, [localQ])

  const { data, isFetching } = useSearch(debouncedQ, {})

  // GSAP entrance
  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
    gsap.fromTo(panelRef.current, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' })
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const handleClose = () => {
    gsap.to(panelRef.current,   { y: -16, opacity: 0, duration: 0.2, ease: 'power3.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.18, onComplete: onClose })
  }

  const handleChange = (e) => {
    const q = e.target.value
    setLocalQ(q)
  }

  const handleClear = () => {
    setLocalQ('')
    inputRef.current?.focus()
  }

  const navigate_ = (path) => { handleClose(); setTimeout(() => navigate(path), 220) }

  const projects = data?.projects || []
  const services = data?.services || []
  const jobs     = data?.jobs     || []
  const totals   = data?.totals   || {}

  const visibleProjects = tab === 'all' ? projects.slice(0, 3) : projects
  const visibleServices = tab === 'all' ? services.slice(0, 3) : services
  const visibleJobs     = tab === 'all' ? jobs.slice(0, 3)     : jobs

  const hasResults = projects.length + services.length + jobs.length > 0
  const searched   = debouncedQ.trim().length >= 2

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      <div ref={overlayRef} onClick={handleClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div ref={panelRef}
        className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
        onClick={(e) => e.stopPropagation()}>

        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
          {isFetching
            ? <Loader2 className="h-4 w-4 text-slate-400 animate-spin flex-shrink-0" />
            : <Search  className="h-4 w-4 text-slate-400 flex-shrink-0" />}
          <input
            ref={inputRef}
            type="text"
            value={localQ}
            onChange={handleChange}
            placeholder="Search projects, services, jobs…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          {localQ && (
            <button onClick={handleClear} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
          <button onClick={handleClose}
            className="rounded-lg border border-slate-700 px-2 py-0.5 text-[10px] text-slate-400 hover:text-slate-200 transition-colors">
            ESC
          </button>
        </div>

        {/* Tabs */}
        {searched && hasResults && (
          <div className="flex gap-1 px-4 pt-3">
            {TABS.map(({ key, label }) => {
              const count = key === 'all'
                ? (totals.projects || 0) + (totals.services || 0) + (totals.jobs || 0)
                : totals[key] || 0
              return (
                <button key={key} onClick={() => setTab(key)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors"
                  style={{
                    background: tab === key ? 'rgba(238,122,24,0.15)' : 'transparent',
                    color:      tab === key ? '#EE7A18' : '#94A3B8',
                  }}>
                  {label}
                  {count > 0 && (
                    <span className="rounded-full px-1.5 py-0.5 text-[10px]"
                      style={{ background: tab === key ? 'rgba(238,122,24,0.2)' : 'rgba(255,255,255,0.06)' }}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto px-2 py-3 space-y-4">
          {!searched && (
            <p className="px-3 py-6 text-center text-sm text-slate-500">
              Type at least 2 characters to search…
            </p>
          )}

          {searched && !isFetching && !hasResults && (
            <p className="px-3 py-6 text-center text-sm text-slate-500">
              No results for <span className="text-white">"{debouncedQ}"</span>
            </p>
          )}

          {(tab === 'all' || tab === 'projects') && visibleProjects.length > 0 && (
            <div>
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Projects</p>
              {visibleProjects.map((p) => (
                <ResultItem key={p.id} item={p} type="project"
                  onClick={() => navigate_(`/projects/${p.slug || p.id}`)} />
              ))}
              {tab === 'all' && totals.projects > 3 && (
                <button onClick={() => setTab('projects')}
                  className="w-full px-3 py-1.5 text-[11px] text-riec-orange text-left hover:underline">
                  View all {totals.projects} projects →
                </button>
              )}
            </div>
          )}

          {(tab === 'all' || tab === 'services') && visibleServices.length > 0 && (
            <div>
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Services</p>
              {visibleServices.map((s) => (
                <ResultItem key={s.id} item={s} type="service"
                  onClick={() => navigate_(`/services/${s.id}`)} />
              ))}
              {tab === 'all' && totals.services > 3 && (
                <button onClick={() => setTab('services')}
                  className="w-full px-3 py-1.5 text-[11px] text-riec-orange text-left hover:underline">
                  View all {totals.services} services →
                </button>
              )}
            </div>
          )}

          {(tab === 'all' || tab === 'jobs') && visibleJobs.length > 0 && (
            <div>
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Jobs</p>
              {visibleJobs.map((j) => (
                <ResultItem key={j.id} item={j} type="job"
                  onClick={() => navigate_(`/careers/${j.slug || j.id}`)} />
              ))}
              {tab === 'all' && totals.jobs > 3 && (
                <button onClick={() => setTab('jobs')}
                  className="w-full px-3 py-1.5 text-[11px] text-riec-orange text-left hover:underline">
                  View all {totals.jobs} jobs →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
