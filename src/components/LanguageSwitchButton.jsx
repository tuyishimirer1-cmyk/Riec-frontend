import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

const LANGUAGES = [
  { code: 'en', name: 'EN', flag: '🇬🇧', dir: 'ltr' },
  { code: 'rw', name: 'RW', flag: '🇷🇼', dir: 'ltr' }
];

function LanguageSwitchButton() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    if (dropdownRef.current && isOpen) {
      gsap.fromTo(dropdownRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    // eslint-disable-next-line react-hooks/immutability
    document.documentElement.dir = LANGUAGES.find(l => l.code === code)?.dir || 'ltr';
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 bg-transparent text-white hover:bg-white/10 rounded transition-colors"
      >
        <span className="text-sm font-semibold">{current.name}</span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden min-w-[120px]"
        >
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                lang.code === current.code ? 'bg-gray-50' : ''
              }`}
            >
              <span>{lang.flag}</span>
              <span className="text-gray-700 font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitchButton;