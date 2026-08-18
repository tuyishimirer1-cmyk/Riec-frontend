/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/static-components */
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, FolderKanban, Briefcase, Users, Mail,
  CreditCard, LogOut, Menu, X, Globe, ChevronDown, Bell, Search,
  Wrench,
} from 'lucide-react'
import gsap from 'gsap'
import { useAuth, useLogout, useGetContactSubmissions } from '../../react-query'

const NAV = [
  { to: '/dashboard/overview',      labelKey: 'dash.nav.overview',      icon: LayoutDashboard },
  { to: '/dashboard/projects',      labelKey: 'dash.nav.projects',       icon: FolderKanban },
  { to: '/dashboard/services',      labelKey: 'dash.nav.services',       icon: Wrench },
  { to: '/dashboard/careers',       labelKey: 'dash.nav.careers',        icon: Briefcase },
  { to: '/dashboard/applications',  labelKey: 'dash.nav.applications',   icon: Users },
  { to: '/dashboard/contact',       labelKey: 'dash.nav.contact',        icon: Mail },
  { to: '/dashboard/payments',      labelKey: 'dash.nav.payments',       icon: CreditCard },
]

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
]

export default function DashboardLayout() {
  const { t, i18n } = useTranslation()
  const navigate    = useNavigate()
  const location    = useLocation()
  const { data: auth } = useAuth()
  const user = auth || {}
  const logoutMutation = useLogout()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [langOpen,   setLangOpen]   = useState(false)
  const [notifOpen,  setNotifOpen]  = useState(false)
  const [search,     setSearch]     = useState('')

  // Fetch unread notifications
  const { data: notificationsData } = useGetContactSubmissions({ page: 1, pageSize: 5 })
  const unreadNotifications = (notificationsData?.items || []).filter(item => !item.read)

  const sidebarRef = useRef(null)
  const contentRef = useRef(null)
  const drawerRef  = useRef(null)
  const overlayRef = useRef(null)
  const notifRef   = useRef(null)

  useEffect(() => {
    gsap.fromTo(sidebarRef.current,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out' })
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', delay: 0.15 })
  }, [])

  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return
    if (drawerOpen) {
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.25 })
      gsap.fromTo(drawerRef.current, { x: '-100%' }, { x: '0%', duration: 0.35, ease: 'power3.out' })
    } else {
      gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.2 })
      gsap.to(drawerRef.current, { x: '-100%', duration: 0.3, ease: 'power3.in' })
    }
  }, [drawerOpen])

  useEffect(() => {
    if (!contentRef.current) return
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' })
  }, [location.pathname])

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
    }
    if (notifOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notifOpen])

  const handleLogout = async () => {
    await logoutMutation.mutateAsync()
    navigate('/login', { replace: true })
  }
  const changeLang   = (code) => { i18n.changeLanguage(code); setLangOpen(false); setDrawerOpen(false) }

  const activeItem  = NAV.find((n) => location.pathname.startsWith(n.to))
  const currentLang = LANGS.find((l) => l.code === i18n.language) || LANGS[0]

  const NavItems = ({ onClose }) => (
    <nav className="flex-1 space-y-1 px-3">
      {NAV.map(({ to, labelKey, icon: Icon }) => (
        <NavLink key={to} to={to} onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'text-white shadow-lg'
                : 'hover:bg-[var(--color-gray-2)]'
            }`
          }
          style={({ isActive }) => isActive
            ? { background: 'var(--color-riec-orange)', color: '#fff', boxShadow: '0 4px 14px rgba(238,122,24,0.35)' }
            : { color: 'var(--color-body-color)' }
          }
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span>{t(labelKey, { defaultValue: labelKey.split('.').pop() })}</span>
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="flex min-h-screen font-sans" style={{ background: 'var(--color-gray-1)' }}>

      {/* ── Desktop Sidebar ── */}
      <aside ref={sidebarRef}
        className="hidden md:flex w-64 flex-shrink-0 flex-col bg-white border-r"
        style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-1)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'var(--color-stroke)' }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-riec-orange/50 text-white"
            style={{ boxShadow: '0 4px 12px rgba(238,122,24,0.35)' }}>
            <img src="/icon.svg" alt="RIEC" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.3em]" style={{ color: 'var(--color-primary)' }}>RIEC</p>
            <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>
              {t('dash.portal', { defaultValue: 'Admin Portal' })}
            </p>
          </div>
        </div>

        <div className="flex-1 py-4 overflow-y-auto">
          <NavItems onClose={() => {}} />
        </div>

        {/* Language switcher */}
        <div className="px-3 pb-3">
          <div className="relative">
            <button onClick={() => setLangOpen((v) => !v)}
              className="flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors hover:bg-[var(--color-gray-1)]"
              style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
            >
              <Globe className="h-3.5 w-3.5" style={{ color: 'var(--color-secondary)' }} />
              <span>{currentLang.flag} {currentLang.label}</span>
              <ChevronDown className={`ml-auto h-3.5 w-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute bottom-full mb-1 left-0 right-0 rounded-xl border bg-white shadow-lg overflow-hidden z-50"
                style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-2)' }}>
                {LANGS.map((l) => (
                  <button key={l.code} onClick={() => changeLang(l.code)}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors hover:bg-[var(--color-gray-1)]"
                    style={i18n.language === l.code
                      ? { color: 'var(--color-secondary)', background: 'rgba(19,194,150,0.08)' }
                      : { color: 'var(--color-body-color)' }}
                  >
                    <span>{l.flag}</span><span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User + logout */}
        <div className="border-t px-3 py-3" style={{ borderColor: 'var(--color-stroke)' }}>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: 'var(--color-gray-1)' }}>
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: 'rgba(238,122,24,0.12)', color: 'var(--color-riec-orange)' }}>
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>{user?.email || 'Admin'}</p>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--color-body-color)' }}>{user?.role || 'STAFF'}</p>
            </div>
            <button onClick={handleLogout} title={t('dash.logout', { defaultValue: 'Logout' })}
              className="flex-shrink-0 rounded-lg p-1.5 transition-colors hover:bg-red-50"
              style={{ color: 'var(--color-dark-6)' }}
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile overlay ── */}
      <div ref={overlayRef} onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 z-40 bg-black/40 opacity-0 pointer-events-none md:hidden" />

      {/* ── Mobile Drawer ── */}
      <div ref={drawerRef}
        className="fixed inset-y-0 left-0 z-50 w-72 -translate-x-full flex flex-col bg-white shadow-2xl md:hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--color-stroke)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold"
              style={{ background: 'var(--color-riec-orange)' }}>R</div>
            <span className="text-sm font-bold tracking-widest" style={{ color: 'var(--color-primary)' }}>RIEC</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="rounded-lg p-1.5 hover:bg-[var(--color-gray-1)]"
            style={{ color: 'var(--color-body-color)' }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <NavItems onClose={() => setDrawerOpen(false)} />
        </div>

        {/* Language in drawer */}
        <div className="border-t px-4 py-3" style={{ borderColor: 'var(--color-stroke)' }}>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-body-color)' }}>
            {t('dash.language', { defaultValue: 'Language' })}
          </p>
          <div className="flex gap-2">
            {LANGS.map((l) => (
              <button key={l.code} onClick={() => changeLang(l.code)}
                className="flex-1 rounded-xl border py-2 text-xs font-medium transition-colors"
                style={i18n.language === l.code
                  ? { borderColor: 'var(--color-secondary)', background: 'rgba(19,194,150,0.08)', color: 'var(--color-secondary)' }
                  : { borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t px-4 py-3" style={{ borderColor: 'var(--color-stroke)' }}>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: 'var(--color-gray-1)' }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: 'rgba(238,122,24,0.12)', color: 'var(--color-riec-orange)' }}>
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>{user?.email || 'Admin'}</p>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--color-body-color)' }}>{user?.role || 'STAFF'}</p>
            </div>
            <button onClick={handleLogout} className="rounded-lg p-1.5 hover:text-red-500"
              style={{ color: 'var(--color-dark-6)' }}>
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-white/90 backdrop-blur px-4 py-3 md:px-6"
          style={{ borderColor: 'var(--color-stroke)' }}>
          <button onClick={() => setDrawerOpen(true)}
            className="rounded-xl p-2 hover:bg-[var(--color-gray-1)] md:hidden"
            style={{ color: 'var(--color-body-color)' }}>
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 max-w-sm"
            style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}>
            <Search className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--color-dark-6)' }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={t('dash.search', { defaultValue: 'Search or type command…' })}
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-[var(--color-dark-6)]"
              style={{ color: 'var(--color-primary)' }}
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative rounded-xl p-2 hover:bg-[var(--color-gray-1)] transition-colors"
                style={{ color: 'var(--color-body-color)' }}
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications.length > 0 && (
                  <>
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
                      style={{ background: 'var(--color-riec-orange)' }} />
                    <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
                      style={{ background: 'var(--color-riec-orange)' }}>
                      {unreadNotifications.length}
                    </span>
                  </>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden"
                  style={{ borderColor: 'var(--color-stroke)' }}>
                  <div className="p-4 border-b" style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}>
                    <h3 className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
                      Notifications
                    </h3>
                    <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>
                      {unreadNotifications.length} unread message{unreadNotifications.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {unreadNotifications.length > 0 ? (
                      unreadNotifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => {
                            navigate('/dashboard/contact')
                            setNotifOpen(false)
                          }}
                          className="p-3 border-b cursor-pointer hover:bg-[var(--color-gray-1)] transition-colors"
                          style={{ borderColor: 'var(--color-stroke)' }}
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                              style={{ background: 'rgba(238,122,24,0.12)', color: 'var(--color-riec-orange)' }}>
                              {notif.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-primary)' }}>
                                {notif.name}
                              </p>
                              <p className="text-[10px] truncate" style={{ color: 'var(--color-body-color)' }}>
                                {notif.subject || 'New message'}
                              </p>
                              <p className="text-[10px] line-clamp-2 mt-1" style={{ color: 'var(--color-dark-5)' }}>
                                {notif.message}
                              </p>
                              <p className="text-[9px] mt-1" style={{ color: 'var(--color-dark-6)' }}>
                                {new Date(notif.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--color-dark-6)' }} />
                        <p className="text-xs" style={{ color: 'var(--color-body-color)' }}>
                          No new notifications
                        </p>
                      </div>
                    )}
                  </div>

                  {unreadNotifications.length > 0 && (
                    <div className="p-3 border-t text-center" style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}>
                      <button 
                        onClick={() => {
                          navigate('/dashboard/contact')
                          setNotifOpen(false)
                        }}
                        className="text-[10px] font-semibold hover:underline"
                        style={{ color: 'var(--color-riec-orange)' }}
                      >
                        View all messages
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-xl border px-3 py-2"
              style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}>
              <div className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: 'rgba(238,122,24,0.12)', color: 'var(--color-riec-orange)' }}>
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="text-xs font-medium max-w-[120px] truncate" style={{ color: 'var(--color-primary)' }}>
                {user?.email || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page title bar */}
        <div className="border-b bg-white px-4 py-3 md:px-6" style={{ borderColor: 'var(--color-stroke)' }}>
          <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: 'var(--color-body-color)' }}>
            {t('dash.dashboard', { defaultValue: 'Dashboard' })}
          </p>
          <h1 className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>
            {activeItem ? t(activeItem.labelKey, { defaultValue: activeItem.labelKey.split('.').pop() }) : t('dash.nav.overview', { defaultValue: 'Overview' })}
          </h1>
        </div>

        <main ref={contentRef} className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
