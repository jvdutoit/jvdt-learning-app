import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'jvdt.reflections'

function readAll(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }catch(e){ return [] }
}

export default function ReflectionCage(){
  const [text, setText] = useState('')
  const [entries, setEntries] = useState(()=>readAll())
  const [status, setStatus] = useState('')

  useEffect(()=>{
    const id = setInterval(()=>{
      if(text.trim()){
        const draft = { id: 'draft', text, createdAt: new Date().toISOString() }
        // store draft separately so saved entries remain intact
        try{ localStorage.setItem('jvdt.reflection.draft', JSON.stringify(draft)) }catch(e){}
        setStatus('Draft saved')
        setTimeout(()=>setStatus(''), 1200)
      }
    }, 1500)
    return ()=>clearInterval(id)
  }, [text])

  function save(){
    if(!text.trim()) return
    const next = readAll()
    const entry = { id: crypto.randomUUID(), text: text.trim(), createdAt: new Date().toISOString() }
    next.unshift(entry)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setEntries(next)
    setText('')
    localStorage.removeItem('jvdt.reflection.draft')
    setStatus('Saved')
    setTimeout(()=>setStatus(''),1200)
  }

  function clearAll(){
    if(!confirm('Clear all saved reflections? This cannot be undone.')) return
    localStorage.removeItem(STORAGE_KEY)
    setEntries([])
    setStatus('Cleared')
    setTimeout(()=>setStatus(''),1200)
  }

  useEffect(()=>{
    const draft = localStorage.getItem('jvdt.reflection.draft')
    if(draft){
      try{ setText(JSON.parse(draft).text || '') }catch(e){}
    }
  }, [])

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Reflection (CAGE)</h1>
      <p className="text-sm text-gray-600 mb-2">Write a short reflection. Autosaves drafts; use Save to store an entry.</p>
      <label htmlFor="reflection-text" className="sr-only">Reflection text</label>
      <textarea id="reflection-text" value={text} onChange={e=>setText(e.target.value)} rows={6} className="w-full p-3 border rounded-md mb-2 bg-white dark:bg-gray-800" placeholder="What did you notice? What changed?" aria-describedby="reflection-stats" />

      <div id="reflection-stats" className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <div>
          <span className="mr-3">Chars: {text.length}</span>
          <span>Words: {text.trim() ? text.trim().split(/\s+/).length : 0}</span>
        </div>
        <div className="text-xs text-gray-500">{status}</div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        <button onClick={()=>{ if(confirm('Discard draft?')) setText('') }} className="px-4 py-2 border rounded">Clear Draft</button>
        <button onClick={clearAll} className="px-4 py-2 border rounded text-red-600">Clear All</button>
      </div>

      <h2 className="text-lg font-medium mb-2">Saved reflections</h2>
      <div className="space-y-3">
        {entries.length===0 && <div className="text-sm text-gray-500">No reflections yet.</div>}
        {entries.map(e=> (
          <div key={e.id} className="p-3 border rounded bg-white dark:bg-gray-800">
            <div className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleString()}</div>
            <div className="mt-1 text-sm text-gray-800 dark:text-gray-200">{e.text}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
