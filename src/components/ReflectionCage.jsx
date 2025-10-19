import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'jvdt.reflections'

function readAll(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }catch(e){ return [] }
}

export default function ReflectionCage(){
  const [text, setText] = useState('')
  const [entries, setEntries] = useState(()=>readAll())

  useEffect(()=>{
    const id = setInterval(()=>{
      if(text.trim()){
        const next = [...readAll()]
        const draft = { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() }
        // temporarily don't push on every autosave; store current draft at top-level key for quick restore
        localStorage.setItem('jvdt.reflection.draft', JSON.stringify(draft))
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
  }

  function clearAll(){
    localStorage.removeItem(STORAGE_KEY)
    setEntries([])
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
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={6} className="w-full p-3 border rounded-md mb-3 bg-white dark:bg-gray-800" placeholder="What did you notice? What changed?" />
      <div className="flex gap-2 mb-4">
        <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        <button onClick={()=>setText('')} className="px-4 py-2 border rounded">Clear Draft</button>
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
