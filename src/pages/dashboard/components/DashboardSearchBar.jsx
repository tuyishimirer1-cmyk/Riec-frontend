import { useRef } from 'react'
import { Search } from 'lucide-react'

/**
 * Lightweight dashboard search input.
 * Calls onChange with the raw string — parent decides which API to call.
 */
export default function DashboardSearchBar({ value, onChange, placeholder = 'Search…', width = 180 }) {
  const inputRef = useRef(null)

  return (
    <div className="relative">
      <Search
        className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
        style={{ color: 'var(--color-dark-6)' }}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border pl-8 pr-3 py-2 text-xs focus:outline-none transition-colors"
        style={{
          borderColor: 'var(--color-stroke)',
          background:  'var(--color-gray-1)',
          color:       'var(--color-primary)',
          width,
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
