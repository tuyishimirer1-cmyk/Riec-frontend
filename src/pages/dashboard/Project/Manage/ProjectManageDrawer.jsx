/* eslint-disable no-unused-vars */
import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { X, Image as ImageIcon, Layers, Tag, Users } from 'lucide-react'
import ImagesPanel      from './ImagesPanel'
import AssetsPanel      from './AssetsPanel'
import TiersPanel       from './TiersPanel'
import AssignmentsPanel from './AssignmentsPanel'

const TABS = [
  { key: 'images',      labelKey: 'dash.manage.tab_images',      icon: ImageIcon },
  { key: 'assets',      labelKey: 'dash.manage.tab_assets',      icon: Layers },
  { key: 'tiers',       labelKey: 'dash.manage.tab_tiers',       icon: Tag },
  { key: 'assignments', labelKey: 'dash.manage.tab_assignments',  icon: Users },
]

export default function ProjectManageDrawer({ project, onClose }) {
  const { t }        = useTranslation()
  const [activeTab, setActiveTab] = useState('images')
  const overlayRef   = useRef(null)
  const panelRef     = useRef(null)

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
    gsap.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.4, ease: 'power3.out' })
  }, [])

  const handleClose = () => {
    gsap.to(panelRef.current, { x: '100%', duration: 0.35, ease: 'power3.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, onComplete: onClose })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div ref={overlayRef} onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Drawer panel */}
      <div ref={panelRef}
        className="relative z-10 flex flex-col bg-white w-full max-w-2xl h-full"
        style={{ boxShadow: '-8px 0 40px rgba(10,45,83,0.14)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 flex-shrink-0"
          style={{ borderColor: 'var(--color-stroke)' }}>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
              {project.title}
            </h3>
            <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>
              {project.slug}
            </p>
          </div>
          <button onClick={handleClose}
            className="rounded-xl p-2 transition-colors hover:bg-[var(--color-gray-1)]"
            style={{ color: 'var(--color-body-color)' }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b flex-shrink-0" style={{ borderColor: 'var(--color-stroke)' }}>
          {TABS.map(({ key, labelKey, icon: Icon }) => {
            const active = activeTab === key
            return (
              <button key={key} onClick={() => setActiveTab(key)}
                className="flex items-center gap-1.5 px-5 py-3 text-xs font-semibold transition-colors relative"
                style={{ color: active ? 'var(--color-riec-orange)' : 'var(--color-body-color)' }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--color-gray-1)' }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon className="h-3.5 w-3.5" />
                {t(labelKey, { defaultValue: key.charAt(0).toUpperCase() + key.slice(1) })}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'var(--color-riec-orange)' }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'images'      && <ImagesPanel      projectId={project.id} />}
          {activeTab === 'assets'      && <AssetsPanel      projectId={project.id} />}
          {activeTab === 'tiers'       && <TiersPanel       projectId={project.id} />}
          {activeTab === 'assignments' && <AssignmentsPanel projectId={project.id} />}
        </div>
      </div>
    </div>
  )
}
