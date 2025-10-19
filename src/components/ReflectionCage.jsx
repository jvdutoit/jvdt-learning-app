import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'jvdt.reflections'
const DRAFT_KEY = 'jvdt.reflection.draft'

function readAll(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }catch(e){ return [] }
}

export default function ReflectionCage(){
  const [text, setText] = useState('')
  const [entries, setEntries] = useState(()=>readAll())
  const [status, setStatus] = useState('')
  const timeoutRef = useRef(null)

  // restore draft on mount
  useEffect(()=>{
    const draft = localStorage.getItem(DRAFT_KEY)
    if(draft){
      try{ setText(JSON.parse(draft).text || '') }catch(e){}
    }
  }, [])

  // debounced autosave: saves draft after user stops typing for ~1200ms
  useEffect(()=>{
    if(timeoutRef.current) window.clearTimeout(timeoutRef.current)
    if(!text.trim()) return
    timeoutRef.current = window.setTimeout(()=>{
      try{
        const draft = { id: 'draft', text, createdAt: new Date().toISOString() }
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
        setStatus('Draft saved')
        window.setTimeout(()=>setStatus(''), 1200)
      }catch(e){}
    }, 1200)
    return ()=>{
      if(timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [text])

  function save(){
    if(!text.trim()) return
    const next = readAll()
    const entry = { id: crypto.randomUUID(), text: text.trim(), createdAt: new Date().toISOString() }
    next.unshift(entry)
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }catch(e){}
    setEntries(next)
    setText('')
    try{ localStorage.removeItem(DRAFT_KEY) }catch(e){}
    setStatus('Saved')
    window.setTimeout(()=>setStatus(''),1200)
  }

  function clearJournal(){
    if(!confirm('Clear your reflections?')) return
    try{ localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(DRAFT_KEY) }catch(e){}
    setEntries([])
    setText('')
    setStatus('Cleared')
    window.setTimeout(()=>setStatus(''),1200)
  }

  const charCount = text.length
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <section className="min-h-[60vh] flex items-start justify-center py-8 bg-gradient-to-br from-rose-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
      <div className="w-full max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-3 text-center">Reflection Journal (CAGE)</h1>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">Write freely — drafts autosave. Use Save to persist entries.</p>

        <motion.textarea
          aria-label="Reflection Journal"
          id="reflection-text"
          value={text}
          onChange={e=>setText(e.target.value)}
          rows={10}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full p-4 border rounded-md mb-3 bg-white dark:bg-gray-800 outline-none transition-colors focus:ring-2 focus:ring-rose-300 dark:focus:ring-amber-400 focus:border-rose-400 text-gray-900 dark:text-gray-100"
          placeholder="What did you notice? What changed?"
          aria-describedby="reflection-stats"
        />

        <div id="reflection-stats" className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div>
            <span className="mr-3">Chars: {charCount}</span>
            <span>Words: {wordCount}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-300">{status}</div>
        </div>

        <div className="flex gap-2 mb-6 justify-center">
          <button data-testid="reflection-save" onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-300">Save</button>
          <button data-testid="reflection-clear-draft" onClick={()=>{ if(confirm('Discard draft?')) setText('') }} className="px-4 py-2 border rounded focus:outline-none focus:ring-2">Clear Draft</button>
          <button data-testid="reflection-clear-all" onClick={clearJournal} className="px-4 py-2 border rounded text-red-600 focus:outline-none focus:ring-2">Clear Journal</button>
        </div>

        <h2 className="text-lg font-medium mb-3">Saved reflections</h2>
        <div className="space-y-3">
          {entries.length===0 && <div className="text-sm text-gray-500 dark:text-gray-400">No reflections yet.</div>}
          {entries.map(e=> (
            <article key={e.id} className="p-3 border rounded bg-white dark:bg-gray-800">
              <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(e.createdAt).toLocaleString()}</div>
              <div className="mt-1 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{e.text}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
