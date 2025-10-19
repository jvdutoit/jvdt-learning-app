import React, { useEffect, useMemo, useState, useRef } from 'react'
import PILLARS from '../data/pillars.json'

const STORAGE_SEARCH = 'jvdt.glossary.search'
const STORAGE_CAT = 'jvdt.glossary.category'

function useDebounced(value, ms = 250) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms)
    return () => clearTimeout(id)
  }, [value, ms])
  return v
}

function truncate(text, n = 180) {
  if (!text) return ''
  if (text.length <= n) return text
  return text.slice(0, n).trim() + '…'
}

export default function Glossary() {
  const [query, setQuery] = useState(() => { try { return localStorage.getItem(STORAGE_SEARCH) || '' } catch { return '' } })
  const [category, setCategory] = useState(() => { try { return localStorage.getItem(STORAGE_CAT) || 'All' } catch { return 'All' } })
  const debounced = useDebounced(query, 250)
  const [expanded, setExpanded] = useState({})
  const inputRef = useRef(null)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_SEARCH, query) } catch {}
  }, [query])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_CAT, category) } catch {}
  }, [category])

  const items = useMemo(() => {
    // Normalize data: accept fields named term/title/name and definition/summary/desc
    return PILLARS.map((p) => ({
      id: p.id ?? p.term ?? p.title ?? Math.random().toString(36).slice(2, 8),
      term: p.term ?? p.title ?? p.name ?? '',
      definition: p.definition ?? p.summary ?? p.desc ?? p.description ?? '',
      category: p.category ?? p.domain ?? p.group ?? 'Uncategorized',
      aka: p.aka ?? p.aliases ?? p.also ?? [],
      examples: p.examples ?? (p.example ? [p.example] : [])
    }))
  }, [])

  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))], [items])

  const filtered = useMemo(() => {
    const q = (debounced || '').trim().toLowerCase()
    return items.filter(it => {
      if (category !== 'All' && it.category !== category) return false
      if (!q) return true
      return (
        it.term.toLowerCase().includes(q) ||
        it.definition.toLowerCase().includes(q) ||
        (it.aka || []).join(' ').toLowerCase().includes(q) ||
        (it.examples || []).join(' ').toLowerCase().includes(q)
      )
    })
  }, [items, debounced, category])

  function toggleMore(id) {
    setExpanded(s => ({ ...s, [id]: !s[id] }))
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-4">Glossary</h1>

      <label htmlFor="glossary-search" className="sr-only">Search terms or categories</label>
      <input
        id="glossary-search"
        ref={inputRef}
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search terms or categories..."
        className="w-full border rounded-lg p-3 mb-4 bg-white dark:bg-gray-800"
        aria-label="Search terms or categories"
      />

      <div className="flex gap-2 flex-wrap mb-6" role="tablist" aria-label="Categories">
        {categories.map(cat => {
          const active = cat === category
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-sm border focus:outline-none ${active ? 'bg-slate-900 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              aria-pressed={active}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-sm text-gray-500">No results. Try a different search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <article key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition">
              <header className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-lg">{item.term}</h2>
                  {item.category && <div className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">{item.category}</div>}
                </div>
              </header>

              <div className="mt-3 text-sm text-gray-700 dark:text-gray-200">
                {expanded[item.id] ? (
                  <p>{item.definition}</p>
                ) : (
                  <p>{truncate(item.definition, 180)}</p>
                )}
                {item.definition && item.definition.length > 180 && (
                  <button onClick={() => toggleMore(item.id)} className="mt-2 text-blue-600 text-sm">
                    {expanded[item.id] ? 'Less' : 'More'}
                  </button>
                )}
              </div>

              <div className="mt-3 text-sm text-gray-500 italic">
                {item.aka && item.aka.length > 0 && <div className="text-xs text-gray-500">aka: {item.aka.join(', ')}</div>}
                {item.examples && item.examples.length > 0 && <div className="mt-2 text-xs">Example: <span className="not-italic text-gray-600">{item.examples[0]}</span></div>}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
