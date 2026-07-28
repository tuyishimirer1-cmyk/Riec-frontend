import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useSearch } from '../../react-query'

const DEBOUNCE_MS = 300

export default function SearchBar({
  value,
  onChange,
  onSelect,
  placeholder = 'Search…',
  dark = false,          // true = dark theme (front pages), false = dashboard
  className = '',
}) {
  const [localQ, setLocalQ] = useState(value || '')
  const [open, setOpen]     = useState(false)
  const debounceRef         = useRef(null)
  const wrapperRef          = useRef(null)

  // Sync external value
  useEffect(() => { setLocalQ(value || '') }, [value])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const { data: suggestions, isFetching: suggestionsLoading } = useSearch(
    localQ, {}
  )

  const handleChange = useCallback((e) => {
    const q = e.target.value
    setLocalQ(q)
    setOpen(q.trim().length >= 2)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onChange?.(q), DEBOUNCE_MS)
  }, [onChange])

  const handleClear = () => {
    setLocalQ('')
    setOpen(false)
    onChange?.('')
  }

  const handleSelect = (item) => {
    setLocalQ(item.text)
    setOpen(false)
    onSelect?.(item)
    onChange?.(item.text)
  }

  const allSuggestions = [
    ...(suggestions?.projects || []),
    ...(suggestions?.services || []),
    ...(suggestions?.jobs     || []),
  ]

  const inputCls = dark
    ? 'w-full rounded-xl border border-slate-700 bg-slate-900/70 py-2.5 pl-9 pr-8 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none focus:ring-1 focus:ring-riec-orange'
    : 'w-full rounded-xl border py-2 pl-8 pr-7 text-xs focus:outline-none transition-colors'

  const inputStyle = dark ? {} : {
    borderColor: 'var(--color-stroke)',
    background:  'var(--color-gray-1)',
    color:       'var(--color-primary)',
  }

  const TYPE_LABEL = { project: 'Project', service: 'Service', job: 'Job' }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <Search className={`pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${dark ? 'text-slate-400' : ''}`}
        style={dark ? {} : { color: 'var(--color-dark-6)' }} />

      <input
        type="text"
        value={localQ}
        onChange={handleChange}
        onFocus={() => { if (localQ.trim().length >= 2) setOpen(true) }}
        placeholder={placeholder}
        className={inputCls}
        style={inputStyle}
      />

      {localQ && (
        <button onClick={handleClear}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${dark ? 'text-slate-400 hover:text-white' : ''}`}
          style={dark ? {} : { color: 'var(--color-dark-6)' }}>
          {suggestionsLoading
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <X className="h-3.5 w-3.5" />}
        </button>
      )}

      {open && allSuggestions.length > 0 && (
        <ul className={`absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border shadow-lg ${
          dark ? 'bg-slate-900 border-slate-700' : 'bg-white'
        }`}
          style={dark ? {} : { borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-2)' }}>
          {allSuggestions.map((item, i) => (
            <li key={i}>
              <button
                onMouseDown={() => handleSelect(item)}
                className={`flex w-full items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                  dark ? 'text-slate-200 hover:bg-slate-800' : ''
                }`}
                style={dark ? {} : { color: 'var(--color-primary)' }}
                onMouseEnter={(e) => { if (!dark) e.currentTarget.style.background = 'var(--color-gray-1)' }}
                onMouseLeave={(e) => { if (!dark) e.currentTarget.style.background = 'transparent' }}
              >
                <span>{item.text}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                  dark ? 'bg-slate-700 text-slate-400' : ''
                }`}
                  style={dark ? {} : { background: 'var(--color-gray-2)', color: 'var(--color-dark-6)' }}>
                  {TYPE_LABEL[item.type] || item.type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
