import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import gsap from 'gsap'
import { ChevronDown, ChevronRight, X, Menu, Heart } from 'lucide-react'
import LanguageSwitchButton from '../../LanguageSwitchButton'
import PropTypes from 'prop-types'

const MobileDrawer = ({ 
  isOpen, 
  onClose, 
  navItems, 
  // eslint-disable-next-line no-unused-vars
  activePage, 
  openQuoteModal,
  logo 
}) => {
  const { t } = useTranslation();
  const drawerRef = useRef(null)
  const overlayRef = useRef(null)
  const [expandedItems, setExpandedItems] = useState(new Set())
  const location = useLocation()

  useEffect(() => {
    const drawer = drawerRef.current
    const overlay = overlayRef.current
    if (!drawer || !overlay) return

    const ctx = gsap.context(() => {
      if (isOpen) {
        // Animate overlay
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        })

        // Animate drawer slide in
        gsap.fromTo(drawer,
          { x: '100%', opacity: 0 },
          { 
            x: '0%', 
            opacity: 1, 
            duration: 0.4, 
            ease: 'power3.out',
            onComplete: () => {
              // Animate menu items after drawer is open
              gsap.fromTo('.mobile-menu-item',
                { x: 50, opacity: 0 },
                { 
                  x: 0, 
                  opacity: 1, 
                  duration: 0.3, 
                  stagger: 0.05, 
                  ease: 'power2.out',
                  delay: 0.1
                }
              )
            }
          }
        )
      } else {
        // Animate overlay
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        })

        // Animate drawer slide out
        gsap.to(drawer, {
          x: '100%',
          opacity: 0,
          duration: 0.3,
          ease: 'power3.in'
        })
      }
    }, [drawerRef, overlayRef])

    return () => ctx.revert()
  }, [isOpen])

  const toggleExpanded = (itemPath) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemPath)) {
        newSet.delete(itemPath)
      } else {
        newSet.add(itemPath)
      }
      return newSet
    })
  }

  const isItemActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const handleLinkClick = () => {
    onClose()
  }

  const handleQuoteClick = () => {
    openQuoteModal && openQuoteModal()
    onClose()
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 opacity-0 pointer-events-none xl:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-screen w-full max-w-xs sm:max-w-sm bg-riec-gradient-soft shadow-2xl transform translate-x-full z-50 xl:hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-700/50 flex justify-between items-center bg-slate-900/95">
          <img src={logo} alt="RIEC Logo" className="h-8 sm:h-10" />
          <button 
            className="text-white p-2 hover:bg-riec-orange/20 rounded-lg transition-all duration-200"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex flex-col h-screen bg-slate-950/95">
          {/* Mobile Navigation Links */}
          <div className="flex-1 py-3 sm:py-4 overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.path} className="mobile-menu-item">
                {item.hasDropdown ? (
                  // Dropdown item
                  <div>
                    <button
                      className={`
                        w-full px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold transition-all duration-200
                        flex items-center justify-between group
                        ${isItemActive(item.path) 
                          ? 'text-riec-orange bg-riec-orange/10 border-r-4 border-riec-orange' 
                          : 'text-slate-200 hover:text-white hover:bg-slate-800/50'
                        }
                      `}
                      onClick={() => toggleExpanded(item.path)}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-sm sm:text-base">{item.text}</span>
                      </span>
                      {expandedItems.has(item.path) ? (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" />
                      )}
                    </button>

                    {/* Expanded dropdown items */}
                    {expandedItems.has(item.path) && (
                      <div className="bg-slate-900/50 border-l-2 border-riec-orange/30 ml-3 sm:ml-4">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            to={dropdownItem.href}
                            className={`
                              block px-4 sm:px-6 py-2.5 sm:py-3 text-sm transition-all duration-200
                              ${isItemActive(dropdownItem.href) 
                                ? 'text-riec-orange bg-riec-orange/5 border-r-2 border-riec-orange' 
                                : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                              }
                            `}
                            onClick={handleLinkClick}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{dropdownItem.text}</span>
                              {isItemActive(dropdownItem.href) && (
                                <svg className="w-3 h-3 text-riec-orange" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular link
                  <Link
                    to={item.href}
                    className={`
                      mobile-menu-item block px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-all duration-200
                      ${isItemActive(item.path) 
                        ? 'text-riec-orange bg-riec-orange/10 border-r-4 border-riec-orange' 
                        : 'text-slate-200 hover:text-white hover:bg-slate-800/50'
                      }
                    `}
                    onClick={handleLinkClick}
                  >
                    <span className="text-sm sm:text-base">{item.text}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Bottom Section */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-700/50 space-y-3 sm:space-y-4 bg-slate-900/95">
            <div className="flex items-center justify-between">
              <LanguageSwitchButton />
              <Link
                to="/favorites"
                className="rounded-full border border-white/20 bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                aria-label={t('nav.favorites', { defaultValue: 'Favorites' })}
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
            <button
              type="button"
              onClick={handleQuoteClick}
              className="w-full bg-riec-orange text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-riec-orange-light transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              Contact Us
            </button>
            
            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                to="/about"
                className="text-center py-2.5 sm:py-3 px-3 bg-slate-800/50 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
                onClick={handleLinkClick}
              >
                About Us
              </Link>
              <Link
                to="/favorites"
                className="text-center py-2.5 sm:py-3 px-3 bg-slate-800/50 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
                onClick={handleLinkClick}
              >
                Favorites
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

MobileDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  navItems: PropTypes.array.isRequired,
  activePage: PropTypes.string.isRequired,
  openQuoteModal: PropTypes.func,
  logo: PropTypes.string.isRequired
}

export default MobileDrawer
