import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import gsap from 'gsap'

const DropdownMenu = ({ item, isActive }) => {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef  = useRef(null)
  const panelRef    = useRef(null)
  const itemsRef    = useRef([])
  const chevronRef  = useRef(null)
  const location    = useLocation()

  const isItemActive = (href) =>
    location.pathname === href || location.pathname.startsWith(href + '/')

  const open = () => {
    clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const close = (delay = 150) => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), delay)
  }

  // Animate in
  useEffect(() => {
    const panel = panelRef.current
    const items = itemsRef.current.filter(Boolean)
    if (!panel) return

    if (isOpen) {
      // Make visible before animating
      gsap.set(panel, { pointerEvents: 'auto' })
      gsap.fromTo(panel,
        { opacity: 0, y: -8, scaleY: 0.92, transformOrigin: 'top center' },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.22, ease: 'power3.out' }
      )
      gsap.fromTo(items,
        { opacity: 0, x: -6 },
        { opacity: 1, x: 0, duration: 0.18, stagger: 0.04, ease: 'power2.out', delay: 0.06 }
      )
      gsap.to(chevronRef.current, { rotation: 180, duration: 0.2, ease: 'power2.out' })
    } else {
      gsap.to(panel,
        { opacity: 0, y: -6, scaleY: 0.94, duration: 0.16, ease: 'power2.in',
          onComplete: () => gsap.set(panel, { pointerEvents: 'none' }) }
      )
      gsap.to(chevronRef.current, { rotation: 0, duration: 0.2, ease: 'power2.out' })
    }
  }, [isOpen])

  if (!item.hasDropdown) return null

  return (
    <div className="relative" onMouseEnter={open} onMouseLeave={() => close()}>

      {/* Trigger */}
      <div className={`
        flex items-center gap-1 py-2 px-1 font-semibold font-poppins cursor-pointer
        select-none relative
        after:content-[''] after:absolute after:bottom-0 after:left-0
        after:w-full after:h-0.5 after:bg-lightblue after:rounded-full
        after:origin-left after:transition-transform after:duration-300
        ${isActive
          ? 'text-lightblue after:scale-x-100'
          : 'text-white hover:text-lightblue after:scale-x-0 hover:after:scale-x-100'}
      `}>
        <Link to={item.href} className="hover:text-lightblue transition-colors duration-200">
          {item.text}
        </Link>
        <svg
          ref={chevronRef}
          className="w-4 h-4 flex-shrink-0"
          style={{ transformOrigin: 'center' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen((v) => !v) }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Bridge */}
      {isOpen && (
        <div className="absolute left-0 top-full w-full h-3" onMouseEnter={open} />
      )}

      {/* Panel — always in DOM so GSAP can animate it */}
      <div
        ref={panelRef}
        onMouseEnter={open}
        onMouseLeave={() => close()}
        style={{ pointerEvents: 'none', opacity: 0 }}
        className="absolute top-[calc(100%+0.75rem)] left-0 w-64 z-50"
      >
        <div className="bg-slate-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
          <div className="py-2">
            {item.dropdownItems?.map((dropdownItem, i) => (
              <Link
                key={dropdownItem.href}
                ref={(el) => { itemsRef.current[i] = el }}
                to={dropdownItem.href}
                onClick={() => setIsOpen(false)}
                className={`
                  block px-6 py-3 text-sm
                  ${isItemActive(dropdownItem.href)
                    ? 'text-riec-orange bg-riec-orange/10 border-r-4 border-riec-orange'
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/50'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{dropdownItem.text}</span>
                  {isItemActive(dropdownItem.href) && (
                    <svg className="w-4 h-4 text-riec-orange" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

DropdownMenu.propTypes = {
  item: PropTypes.shape({
    text: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    hasDropdown: PropTypes.bool,
    dropdownItems: PropTypes.arrayOf(PropTypes.shape({
      href: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }))
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
}

export default DropdownMenu
