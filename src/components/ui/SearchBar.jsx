import { useRef } from 'react'
import { Search } from 'lucide-react'

/**
 * SearchBar component for public pages (Projects, Plans, etc.)
 * Calls onSearch with the search string when user types
 */
export default function SearchBar({ 
  value, 
  onChange, 
  onSearch,
  placeholder = 'Search projects...', 
  className = ''
}) {
  const inputRef = useRef(null)

  const handleChange = (e) => {
    const newValue = e.target.value
    if (onChange) onChange(newValue)
    if (onSearch) onSearch(newValue)
  }

  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
        style={{ color: 'var(--color-dark-6)' }}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
        style={{
          borderColor: 'var(--color-stroke)',
          background:  'var(--color-gray-1)',
          color:       'var(--color-primary)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-riec-orange)'
          e.target.style.background  = '#fff'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--color-stroke)'
          e.target.style.background  = 'var(--color-gray-1)'
        }}
      />
    </div>
  )
}
