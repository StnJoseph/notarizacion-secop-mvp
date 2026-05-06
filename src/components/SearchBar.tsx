'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { obtenerTodosLosNoticeUIDs } from '../lib/data'

export default function SearchBar() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [allUIDs, setAllUIDs] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    obtenerTodosLosNoticeUIDs().then(setAllUIDs)
  }, [])

  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([])
      setIsOpen(false)
      return
    }
    const filtered = allUIDs
      .filter((uid) => uid.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
    setSuggestions(filtered)
    setIsOpen(filtered.length > 0)
  }, [query, allUIDs])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(uid: string) {
    setQuery(uid)
    setIsOpen(false)
    router.push(`/buscar?id=${encodeURIComponent(uid)}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') setIsOpen(false)
    if (e.key === 'Enter' && suggestions.length > 0) handleSelect(suggestions[0])
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Buscar noticeUID (ej: CO1.NTC.1595102)"
          className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] transition-shadow text-sm"
          aria-label="Buscar comprobante por noticeUID"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        >
          {suggestions.map((uid) => (
            <li key={uid} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => handleSelect(uid)}
                className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 transition-colors font-mono"
              >
                {uid}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
