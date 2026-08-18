import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FolderKanban, Briefcase, Users, Mail, TrendingUp, TrendingDown } from 'lucide-react'
import gsap from 'gsap'
import {
  useGetProjects,
  useGetCareers,
  useGetApplications,
  useGetContactSubmissions,
  useMarkSubmissionRead,
  useGetDashboardStats,
} from '../../react-query'
import Card from '../../components/ui/Card'

const CATEGORIES = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL']
const CAT_COLORS = {
  RESIDENTIAL: 'var(--color-secondary)',
  COMMERCIAL: 'var(--color-riec-orange)',
  INDUSTRIAL: 'var(--color-my-blue)',
}

export default function OverviewPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // API calls for data fetching
  const { data: projectsData } = useGetProjects({ page: 1, limit: 8 })
  const { data: careersData } = useGetCareers({ page: 1, limit: 6 })
  const { data: applicationsData } = useGetApplications({ page: 1, limit: 6 })
  const { data: submissionsData } = useGetContactSubmissions({ page: 1, pageSize: 6 })
  const { data: dashboardStats } = useGetDashboardStats('30d')
  const markReadMutation = useMarkSubmissionRead()

  const projects = projectsData?.items || []
  const meta = projectsData || {}
  const careers = careersData?.items || []
  const applications = applicationsData?.items || []
  const submissions = submissionsData?.items || []
  const overview = dashboardStats?.overview || {}

  const cardsRef = useRef([])
  const rowRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(cardsRef.current.filter(Boolean),
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.09, ease: 'power3.out' })
    gsap.fromTo(rowRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.4 })
  }, [])

  const total = overview.projects ?? meta.total ?? projects.length
  const unread = overview.unreadSubmissions ?? submissions.filter((s) => !s.read).length
  const pendingApplications = overview.pendingApplications ?? applications.length
  const openCareers = overview.jobs ?? careers.length

  const markRead = async (id) => {
    await markReadMutation.mutateAsync(id)
  }

  const kpis = [
    {
      label: t('dash.kpi.projects', { defaultValue: 'Total Projects' }),
      value: total,
      icon: FolderKanban,
      trend: '+12%',
      up: true,
      bg: 'rgba(238,122,24,0.10)',
      iconColor: 'var(--color-riec-orange)',
      linkTo: '/dashboard/projects',
    },
    {
      label: t('dash.kpi.careers', { defaultValue: 'Open Careers' }),
      value: openCareers,
      icon: Briefcase,
      trend: '+3%',
      up: true,
      bg: 'rgba(19,194,150,0.10)',
      iconColor: 'var(--color-secondary)',
      linkTo: '/dashboard/careers',
    },
    {
      label: t('dash.kpi.applications', { defaultValue: 'Applications' }),
      value: pendingApplications,
      icon: Users,
      trend: '+8%',
      up: true,
      bg: 'rgba(30,154,224,0.10)',
      iconColor: 'var(--color-my-blue)',
      linkTo: '/dashboard/applications',
    },
    {
      label: t('dash.kpi.unread', { defaultValue: 'Unread Messages' }),
      value: unread,
      icon: Mail,
      trend: submissions.length > 0 ? '-2%' : '0%',
      up: unread < submissions.length,
      bg: 'rgba(225,27,37,0.10)',
      iconColor: 'var(--color-riec-red)',
      linkTo: '/dashboard/contact',
    },
  ]

  return (
    <div className="space-y-6" role="main">
      <h1 className="sr-only">{t('dash.nav.overview', { defaultValue: 'Overview' })}</h1>

      {/* KPI cards */}
      <section aria-label={t('dash.kpi.title', { defaultValue: 'Key Metrics' })}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k, i) => {
            const Icon = k.icon
            const handleMouseEnter = (el) => {
              gsap.to(el, { scale: 1.04, duration: 0.25, ease: 'power2.out' })
              gsap.to(el, { boxShadow: '0 12px 32px rgba(0,0,0,0.18)', duration: 0.25 })
            }
            const handleMouseLeave = (el) => {
              gsap.to(el, { scale: 1, duration: 0.25, ease: 'power2.out' })
              gsap.to(el, { boxShadow: '0 2px 8px rgba(0,0,0,0.08)', duration: 0.25 })
            }
            const handleMouseDown = (el) => {
              gsap.to(el, { scale: 0.97, duration: 0.1, ease: 'power2.in' })
            }
            const handleMouseUp = (el) => {
              gsap.to(el, { scale: 1.04, duration: 0.15, ease: 'elastic.out(1, 0.4)' })
            }
            return (
              <Card
                key={k.label}
              >
                <div
                  ref={(el) => { cardsRef.current[i] = el }}
                  className="p-5 flex items-start justify-between cursor-pointer"
                  onClick={() => navigate(k.linkTo)}
                  onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
                  onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                  onMouseDown={(e) => handleMouseDown(e.currentTarget)}
                  onMouseUp={(e) => handleMouseUp(e.currentTarget)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate(k.linkTo)
                    }
                  }}
                  aria-label={`View ${k.label}: ${k.value} items`}
                >
                  <div>
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-body-color)' }}>{k.label}</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }} aria-label={`${k.label}: ${k.value}`}>{k.value}</p>
                    <span
                      className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold"
                      style={{ color: k.up ? 'var(--color-secondary)' : 'var(--color-riec-red)' }}
                      aria-label={`Trend: ${k.trend}`}
                    >
                      {k.up ? <TrendingUp className="h-3 w-3" aria-hidden="true" /> : <TrendingDown className="h-3 w-3" aria-hidden="true" />}
                      {k.trend}
                    </span>
                  </div>
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl flex-shrink-0"
                    style={{ background: k.bg, color: k.iconColor }}
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Middle row */}
      <section aria-label={t('dash.content.main', { defaultValue: 'Dashboard Content' })}>
        <div ref={rowRef} className="grid gap-4 lg:grid-cols-3">

          {/* Projects by category */}
          <Card className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between px-5 pt-5">
              <h2 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                {t('dash.projects_by_cat', { defaultValue: 'Projects by Category' })}
              </h2>
              <span className="text-xs" style={{ color: 'var(--color-body-color)' }}>
                {total} {t('dash.total', { defaultValue: 'total' })}
              </span>
            </div>

            <div className="px-5 space-y-4">
              {CATEGORIES.map((cat) => {
                const count = projects.filter((p) => p.category === cat).length
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={cat}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium" style={{ color: 'var(--color-body-color)' }}>{cat}</span>
                      <span style={{ color: 'var(--color-dark-6)' }}>{count} / {total}</span>
                    </div>
                    <div
                      className="h-2.5 overflow-hidden rounded-full"
                      style={{ background: 'var(--color-gray-2)' }}
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label={`${cat}: ${pct}%`}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: CAT_COLORS[cat] }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 space-y-2">
              {projects.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl px-3 py-2"
                  style={{ background: 'var(--color-gray-1)' }}
                >
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>{p.title}</p>
                    <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>{p.location || 'Location N/A'} · {p.category}</p>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={p.isPublished
                      ? { background: 'rgba(19,194,150,0.12)', color: 'var(--color-secondary)' }
                      : { background: 'var(--color-gray-2)', color: 'var(--color-body-color)' }}
                  >
                    {p.isPublished ? t('dash.live', { defaultValue: 'Live' }) : t('dash.draft', { defaultValue: 'Draft' })}
                  </span>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-xs text-center py-4" style={{ color: 'var(--color-body-color)' }}>
                  {t('dash.no_projects', { defaultValue: 'No projects yet.' })}
                </p>
              )}
            </div>
          </Card>

          {/* Messages */}
          <Card>
            <div className="mb-4 flex items-center justify-between px-5 pt-5">
              <h2 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                {t('dash.messages', { defaultValue: 'Messages' })}
              </h2>
              {unread > 0 && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: 'rgba(225,27,37,0.10)', color: 'var(--color-riec-red)' }}
                  aria-label={`${unread} unread messages`}
                >
                  {unread} {t('dash.new', { defaultValue: 'new' })}
                </span>
              )}
            </div>
            <div className="px-5 space-y-3">
              {submissions.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5"
                  style={{ background: 'var(--color-gray-1)' }}
                >
                  <div
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: 'rgba(238,122,24,0.12)', color: 'var(--color-riec-orange)' }}
                    aria-hidden="true"
                  >
                    {s.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-primary)' }}>{s.name}</p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--color-body-color)' }}>{s.email}</p>
                    <p className="mt-0.5 text-[10px] line-clamp-1" style={{ color: 'var(--color-dark-5)' }}>{s.message}</p>
                  </div>
                  {!s.read && (
                    <button
                      onClick={() => markRead(s.id)}
                      className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors hover:opacity-80"
                      style={{ background: 'rgba(19,194,150,0.12)', color: 'var(--color-secondary)' }}
                    >
                      {t('dash.mark_read', { defaultValue: 'Mark read' })}
                    </button>
                  )}
                </div>
              ))}
              {submissions.length === 0 && (
                <p className="text-xs text-center py-4" style={{ color: 'var(--color-body-color)' }}>
                  {t('dash.no_messages', { defaultValue: 'No messages yet.' })}
                </p>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* Bottom row */}
      <section aria-label={t('dash.content.secondary', { defaultValue: 'Additional Dashboard Content' })}>
        <div className="grid gap-4 md:grid-cols-2">

          {/* Open careers */}
          <Card>
            <div className="mb-4 flex items-center justify-between px-5 pt-5">
              <h2 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                {t('dash.open_careers', { defaultValue: 'Open Careers' })}
              </h2>
              <span className="text-xs" style={{ color: 'var(--color-body-color)' }}>
                {careers.length} {t('dash.roles', { defaultValue: 'roles' })}
              </span>
            </div>
            <div className="px-5 space-y-2">
              {careers.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5"
                  style={{ background: 'var(--color-gray-1)' }}
                >
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>{c.title}</p>
                    <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>{c.location} · {c.department}</p>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: 'rgba(19,194,150,0.12)', color: 'var(--color-secondary)' }}
                  >
                    {c.employmentType}
                  </span>
                </div>
              ))}
              {careers.length === 0 && (
                <p className="text-xs text-center py-4" style={{ color: 'var(--color-body-color)' }}>
                  {t('dash.no_roles', { defaultValue: 'No open roles.' })}
                </p>
              )}
            </div>
          </Card>

          {/* Recent applications */}
          <Card>
            <div className="mb-4 flex items-center justify-between px-5 pt-5">
              <h2 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                {t('dash.recent_apps', { defaultValue: 'Recent Applications' })}
              </h2>
              <span className="text-xs" style={{ color: 'var(--color-body-color)' }}>
                {applications.length} {t('dash.total', { defaultValue: 'total' })}
              </span>
            </div>
            <div className="px-5 space-y-2">
              {applications.slice(0, 4).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  style={{ background: 'var(--color-gray-1)' }}
                >
                  <div
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: 'rgba(30,154,224,0.12)', color: 'var(--color-my-blue)' }}
                    aria-hidden="true"
                  >
                    {a.fullName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-primary)' }}>{a.fullName}</p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--color-body-color)' }}>{a.email}</p>
                  </div>
                  <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--color-body-color)' }}>
                    {a.job?.title || a.jobId}
                  </span>
                </div>
              ))}
              {applications.length === 0 && (
                <p className="text-xs text-center py-4" style={{ color: 'var(--color-body-color)' }}>
                  {t('dash.no_apps', { defaultValue: 'No applications yet.' })}
                </p>
              )}
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}