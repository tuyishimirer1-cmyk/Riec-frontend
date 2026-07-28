import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types"
import { useTranslation } from 'react-i18next';
import logoOne from '../../assets/logo_2.svg';
import logoTwo from '../../assets/logo.svg';
import LanguageSwitchButton from "../LanguageSwitchButton";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { slideDownFromTop, staggerSlideDown } from '../../utils/animations';
import { useQuoteModal } from "../layouts/MainLayout";
import DropdownMenu from './Navigation/DropdownMenu';
import MobileDrawer from './Navigation/MobileDrawer';
import GlobalSearchModal from '../ui/GlobalSearchModal';
import { Search, Heart } from 'lucide-react';
import { useGetServices, useGetCategories } from '../../react-query';

const Navigation = ({isDefault}) => {
  const { t } = useTranslation();
  const { openQuoteModal } = useQuoteModal() || {};
  const [navColor, setNavColor] = useState('transparent');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('/');
  const navRef = useRef(null);
  const menuItemsRef = useRef([]);

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);

  // Fetch nav data — small page size, cached by React Query
  const { data: servicesData } = useGetServices({ page: 1, limit: 20 })
  const { data: categoriesData } = useGetCategories()

  const allServices = servicesData?.items || []
  const apiCategories = categoriesData || []

  const CATEGORY_LABELS = {
    RESIDENTIAL: 'Residential',
    COMMERCIAL:  'Commercial',
    INDUSTRIAL:  'Industrial',
  }

  // Always show all three categories; use API list if available, fallback to known set
  const categories = apiCategories.length > 0
    ? apiCategories
    : ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL']

  const navItems = [
    { href: '/', text: t('nav.home'), path: '/' },
    {
      href: '/services',
      text: t('nav.services'),
      path: '/services',
      hasDropdown: true,
      dropdownItems: allServices.length > 0
        ? allServices.slice(0, 8).map((s) => ({
            href: `/services/${s.id}`,
            text: s.name || s.title,
          }))
        : [{ href: '/services', text: t('nav.all_services', { defaultValue: 'All Services' }) }],
    },
    {
      href: '/projects',
      text: t('nav.completed_projects'),
      path: '/projects',
      hasDropdown: true,
      dropdownItems: categories.map((cat) => ({
        href: `/projects/category/${cat.toLowerCase()}`,
        text: CATEGORY_LABELS[cat] || cat,
      })),
    },
    {
      href: '/plans',
      text: t('nav.plans'),
      path: '/plans',
      hasDropdown: true,
      dropdownItems: categories.map((cat) => ({
        href: `/plans/category/${cat.toLowerCase()}`,
        text: CATEGORY_LABELS[cat] || cat,
      })),
    },
    { href: '/about', text: t('nav.about_us'), path: '/about' },
    { href: '/careers', text: t('nav.careers', { defaultValue: 'Careers' }), path: '/careers' },
    { href: '/contact', text: t('nav.contact', { defaultValue: 'Contact' }), path: '/contact' },
  ]

  const handleScroll = () => {
    const isHome = location.pathname === '/'
    if (isHome) {
      setNavColor(window.scrollY > 80 ? 'bg-riec-gradient' : 'transparent')
    } else {
      // Non-home pages: always solid — content starts below the nav
      setNavColor('bg-riec-gradient')
    }
  }

  useEffect(() => {
    // Set initial state
    if (location.pathname !== '/') {
      setNavColor('bg-riec-gradient')
    } else {
      setNavColor(isDefault ? 'bg-riec-gradient' : 'transparent')
    }
    window.addEventListener('scroll', handleScroll)
    // Run once on mount to catch current scroll position
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDefault, location.pathname])

  useEffect(() => {
    if (navRef.current) {
      slideDownFromTop(navRef.current, { delay: 0.2 });
    }
    if (menuItemsRef.current.length > 0) {
      staggerSlideDown(menuItemsRef.current, { delay: 0.5 });
    }
  }, []);

  const logo = navColor === 'transparent' ? logoTwo : logoOne;

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 w-full px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 transition-colors duration-300 ${navColor} backdrop-blur-lg shadow-md z-50`}>
      <div className="max-w-screen-2xl mx-auto">
        {/* Main Navigation Bar */}
        <div className="flex justify-between items-center">
          <Link to='/' className="flex items-center space-x-4">
            {/* Logo */}
            <img src={logo} alt="Orvantis Holdings Logo" className="h-10 w-auto"/>
          </Link>

          {/* Hamburger Menu for Mobile */}
          <button 
            className="xl:hidden text-white p-2 sm:p-3 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
          >
            <svg 
              className="w-6 h-6 sm:w-7 sm:h-7" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex flex-1 justify-center">
            <ul className="flex items-center space-x-3 sm:space-x-5 xl:space-x-8">
              {navItems.map((item, index) => (
                <li key={item.path} className="relative group" ref={el => menuItemsRef.current[index] = el}>
                  {item.hasDropdown ? (
                    <DropdownMenu item={item} isActive={activePage === item.path || activePage.startsWith(item.path + '/')} />
                  ) : (
                    <Link
                      to={item.href}
                      className={`
                        flex items-center gap-1 transition-all duration-300
                        py-2 px-3 sm:px-4
                        text-sm sm:text-base xl:text-base
                        font-semibold
                        font-poppins
                        ${activePage === item.path ? 'text-lightblue font-bold' : 'text-white'}
                        hover:text-lightblue
                        relative
                        after:content-['']
                        after:absolute
                        after:w-full
                        after:h-0.5
                        after:bg-lightblue
                        after:left-0
                        after:bottom-0
                        after:rounded-full
                        after:origin-left
                        after:scale-x-0
                        after:transition-transform
                        after:duration-300
                        hover:after:scale-x-100
                      `}
                    >
                      {item.text}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden xl:flex items-center ml-auto gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('nav.search', { defaultValue: 'Search…' })}</span>
            </button>
             <LanguageSwitchButton />
             <button
               onClick={() => navigate('/favorites')}
               className="rounded-full border border-white/20 bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
               aria-label={t('nav.favorites', { defaultValue: 'Favorites' })}
             >
               <Heart className="h-3.5 w-3.5" />
             </button>
             <button
              className="bg-white text-gray-900 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-semibold hover:bg-gray-100 transition-colors duration-300"
              type="button"
              onClick={openQuoteModal}
            >
              {t('nav.get_a_quote')}
            </button>
          </div>
        </div>

        {searchOpen && <GlobalSearchModal onClose={() => setSearchOpen(false)} />}

        {/* Mobile Drawer */}
        <MobileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          navItems={navItems}
          activePage={activePage}
          openQuoteModal={openQuoteModal}
          logo={logoOne}
        />
      </div>
    </nav>

  )
}

export default Navigation

Navigation.propTypes = {
  isAuthenticated: PropTypes.bool,
  setIsAuthenticated: PropTypes.any,
  isDefault: PropTypes.bool,
}
