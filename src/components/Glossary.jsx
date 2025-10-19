import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import PILLARS from '../data/pillars.json'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'

const STORAGE_SEARCH = 'jvdt.glossary.search'
const STORAGE_CAT = 'jvdt.glossary.category'
const STORAGE_LAST = 'jvdt.glossary.lastTerm'

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

function slugify(s) {
  return (s || '').toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function highlightText(text = '', q = ''){
  if(!q) return text
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'ig'))
  return parts.map((part, i) => (
    part.toLowerCase() === q.toLowerCase() ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-600 px-0">{part}</mark> : part
  ))
}

export default function Glossary() {
  const [query, setQuery] = useState(() => { try { return localStorage.getItem(STORAGE_SEARCH) || '' } catch { return '' } })
  const [category, setCategory] = useState(() => { try { return localStorage.getItem(STORAGE_CAT) || 'All' } catch { return 'All' } })
  const debounced = useDebounced(query, 250)
  const [expanded, setExpanded] = useState({})
  const inputRef = useRef(null)

  // Drawer state and URL sync
  const [searchParams, setSearchParams] = useSearchParams()
  const urlTerm = searchParams.get('term') || ''
  const [selectedSlug, setSelectedSlug] = useState('')
  const [preloadedSlug, setPreloadedSlug] = useState('')
  const lastFocusedRef = useRef(null)
  const drawerRef = useRef(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => { try { localStorage.setItem(STORAGE_SEARCH, query) } catch {} }, [query])
  useEffect(() => { try { localStorage.setItem(STORAGE_CAT, category) } catch {} }, [category])

  const items = useMemo(() => {
    return PILLARS.map((p) => {
      const term = p.term ?? p.title ?? p.name ?? ''
      const definition = p.definition ?? p.summary ?? p.desc ?? p.description ?? ''
      const category = p.category ?? p.domain ?? p.group ?? 'Uncategorized'
      const aka = Array.isArray(p.aka) ? p.aka : (typeof p.aka === 'string' ? p.aka.split(',').map(s=>s.trim()).filter(Boolean) : (p.aliases ?? []))
      const examples = Array.isArray(p.examples) ? p.examples : (p.example ? [p.example] : [])
      const related = p.related ?? p.related_terms ?? p.relatedSlugs ?? []
      const slug = slugify(term) || (p.id ? String(p.id) : Math.random().toString(36).slice(2,8))
      return { raw: p, term, definition, category, aka, examples, related, slug }
    })
  }, [])

  const itemsBySlug = useMemo(() => {
    const m = new Map()
    for(const it of items) m.set(it.slug, it)
    return m
  }, [items])

  // categories derived from data
  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))], [items])

  useEffect(() => {
    // If URL has term, open it
    if (urlTerm) {
      if (itemsBySlug.has(urlTerm)) {
        setSelectedSlug(urlTerm)
        try { localStorage.setItem(STORAGE_LAST, urlTerm) } catch {}
      }
    } else {
      // no url param: preload lastTerm if present
      try {
        const last = localStorage.getItem(STORAGE_LAST)
        if (last && itemsBySlug.has(last)) setPreloadedSlug(last)
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTerm, itemsBySlug])

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

  function toggleMore(id) { setExpanded(s => ({ ...s, [id]: !s[id] })) }

  const openTerm = useCallback((slug) => {
    if (!slug || !itemsBySlug.has(slug)) return
    lastFocusedRef.current = document.activeElement
    setSelectedSlug(slug)
    setSearchParams({ term: slug })
    try { localStorage.setItem(STORAGE_LAST, slug) } catch {}
    // focus will be moved to close button by useEffect when drawer opens
  }, [itemsBySlug, setSearchParams])

  const closeDrawer = useCallback(() => {
    setSelectedSlug('')
    setSearchParams({})
    // restore focus
    try { if (lastFocusedRef.current && typeof lastFocusedRef.current.focus === 'function') lastFocusedRef.current.focus() } catch {}
  }, [setSearchParams])

  // keyboard handlers for esc and Cmd/Ctrl+W
  useEffect(() => {
    function onKey(e) {
      if (!selectedSlug) return
      if (e.key === 'Escape') { e.preventDefault(); closeDrawer() }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') { e.preventDefault(); closeDrawer() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedSlug, closeDrawer])

  // focus trap inside drawer
  useEffect(() => {
    if (!selectedSlug) return
    const node = drawerRef.current
    if (!node) return
    const focusable = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    const elements = Array.from(node.querySelectorAll(focusable)).filter((el) => !el.hasAttribute('disabled'))
    if (elements.length) elements[0].focus()

    function handleTab(e) {
      if (e.key !== 'Tab') return
      const idx = elements.indexOf(document.activeElement)
      if (e.shiftKey) {
        if (idx === 0) { e.preventDefault(); elements[elements.length - 1].focus() }
      } else {
        if (idx === elements.length - 1) { e.preventDefault(); elements[0].focus() }
      }
    }
    node.addEventListener('keydown', handleTab)
    return () => node.removeEventListener('keydown', handleTab)
  }, [selectedSlug])

  function onBackdropClick(e){ if (e.target === e.currentTarget) closeDrawer() }

  async function onCopyLink(){
    const url = window.location.origin + window.location.pathname + '?term=' + encodeURIComponent(selectedSlug)
    try{ await navigator.clipboard.writeText(url); setCopied(true); setTimeout(()=>setCopied(false),1500) }catch(e){ console.warn('copy failed', e) }
  }

  function onRelatedClick(slug){
    // update drawer content without closing
    if (!itemsBySlug.has(slug)) return
    setSelectedSlug(slug)
    setSearchParams({ term: slug })
    try { localStorage.setItem(STORAGE_LAST, slug) } catch {}
  }

  // highlighting query inside drawer
  const activeQuery = debounced.trim()

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
            <article key={item.slug} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition">
              <button onClick={() => openTerm(item.slug)} className="text-left w-full" aria-haspopup="dialog">
                <header className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-lg">{item.term}</h2>
                    {item.category && <div className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">{item.category}</div>}
                  </div>
                </header>

                <div className="mt-3 text-sm text-gray-700 dark:text-gray-200">
                  <p>{expanded[item.slug] ? item.definition : truncate(item.definition, 180)}</p>
                  {item.definition && item.definition.length > 180 && (
                    <button onClick={(e) => { e.stopPropagation(); toggleMore(item.slug) }} className="mt-2 text-blue-600 text-sm">
                      {expanded[item.slug] ? 'Less' : 'More'}
                    </button>
                  )}
                </div>

                <div className="mt-3 text-sm text-gray-500 italic">
                  {item.aka && item.aka.length > 0 && <div className="text-xs text-gray-500">aka: {item.aka.join(', ')}</div>}
                  {item.examples && item.examples.length > 0 && <div className="mt-2 text-xs">Example: <span className="not-italic text-gray-600">{item.examples[0]}</span></div>}
                </div>
              </button>
            </article>
          ))}
        </div>
      )}

      {/* Drawer */}
      <AnimatePresence>
        {selectedSlug && itemsBySlug.has(selectedSlug) && (
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onMouseDown={onBackdropClick}>
            <div className="absolute inset-0 bg-black/40" />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="glossary-drawer-title"
              data-testid="glossary-drawer"
              className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-6 overflow-auto"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="glossary-drawer-title" className="text-xl font-semibold">{itemsBySlug.get(selectedSlug).term}</h2>
                  {itemsBySlug.get(selectedSlug).category && <div className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">{itemsBySlug.get(selectedSlug).category}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <button data-testid="drawer-copylink" onClick={onCopyLink} className="px-3 py-2 border rounded text-sm">Copy link</button>
                  <button data-testid="drawer-close" onClick={closeDrawer} className="px-3 py-2 rounded border">Close</button>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-800 dark:text-gray-200">
                <div className="prose dark:prose-invert">{activeQuery ? highlightText(itemsBySlug.get(selectedSlug).definition, activeQuery) : itemsBySlug.get(selectedSlug).definition}</div>

                {itemsBySlug.get(selectedSlug).aka && itemsBySlug.get(selectedSlug).aka.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium">Also known as</h3>
                    <div className="text-sm text-gray-500">{itemsBySlug.get(selectedSlug).aka.join(', ')}</div>
                  </div>
                )}

                {itemsBySlug.get(selectedSlug).examples && itemsBySlug.get(selectedSlug).examples.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium">Examples</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {itemsBySlug.get(selectedSlug).examples.map((ex,i)=>(<li key={i}>{ex}</li>))}
                    </ul>
                  </div>
                )}

                {itemsBySlug.get(selectedSlug).related && itemsBySlug.get(selectedSlug).related.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium">Related</h3>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {itemsBySlug.get(selectedSlug).related.map((r,i)=>{
                        const target = itemsBySlug.get(slugify(r)) || itemsBySlug.get(r)
                        const slug = target ? target.slug : slugify(r)
                        return (
                          <button key={i} onClick={() => onRelatedClick(slug)} className="text-sm px-3 py-1 border rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={`Open related term ${r}`}>
                            {target ? target.term : r}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <small className="text-xs text-gray-500">Share: </small>
                <div className="mt-2">{copied && <span className="text-sm text-green-600">Copied!</span>}</div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
