'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { obtenerTodosLosNoticeUIDs } from '../lib/data'

function highlightMatch(text: string, query: string): ReactNode {
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (!query.trim() || index === -1) return text
  return (
    <>
      {text.slice(0, index)}
      <span className="font-bold text-[#1e3a8a]">{text.slice(index, index + query.length)}</span>
      {text.slice(index + query.length)}
    </>
  )
}

export default function SearchBar() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [allUIDs, setAllUIDs] = useState<string[]>([])
  const [filteredUIDs, setFilteredUIDs] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    obtenerTodosLosNoticeUIDs()
      .then(setAllUIDs)
      .finally(() => setIsLoading(false))
  }, [])

  // Debounced filter: 150ms prevents filtering on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      const q = query.trim()
      if (!q) {
        setFilteredUIDs([])
        setIsOpen(false)
        setActiveIndex(-1)
        return
      }
      setFilteredUIDs(
        allUIDs.filter((uid) => uid.toLowerCase().includes(q.toLowerCase())).slice(0, 5)
      )
      setIsOpen(true)
      setActiveIndex(-1)
    }, 150)
    return () => clearTimeout(timer)
  }, [query, allUIDs])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function handleSelect(uid: string) {
    setQuery('')
    setFilteredUIDs([])
    setIsOpen(false)
    setActiveIndex(-1)
    router.push(`/buscar?id=${encodeURIComponent(uid)}`)
  }

  function handleClear() {
    setQuery('')
    setFilteredUIDs([])
    setIsOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'Escape':
        setIsOpen(false)
        setActiveIndex(-1)
        break
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => Math.min(prev + 1, filteredUIDs.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => Math.max(prev - 1, -1))
        break
      case 'Enter':
        if (activeIndex >= 0 && filteredUIDs[activeIndex]) {
          handleSelect(filteredUIDs[activeIndex])
        } else if (filteredUIDs.length > 0) {
          handleSelect(filteredUIDs[0])
        }
        break
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        {/* Search icon — left */}
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          role="combobox"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Buscar por ID de contrato (ej: CO1.PCCNTR.xxxxxxx)"
          className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 bg-white text-base text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
          aria-label="Buscar comprobante por ID de contrato"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Right slot: loading spinner → clear button → empty */}
        <div className="absolute inset-y-0 right-3 flex items-center">
          {isLoading ? (
            <svg
              className="w-4 h-4 text-gray-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto"
        >
          {filteredUIDs.length > 0 ? (
            filteredUIDs.map((uid, i) => (
              <li
                key={uid}
                id={`suggestion-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                className="border-b border-gray-100 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => handleSelect(uid)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium font-mono transition-colors ${
                    i === activeIndex
                      ? 'bg-blue-100 text-gray-900'
                      : 'text-gray-900 hover:bg-blue-50'
                  }`}
                >
                  {highlightMatch(uid, query)}
                </button>
              </li>
            ))
          ) : (
            <li role="option" aria-selected={false}>
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No se encontraron resultados
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
