import React, { useEffect, useState } from 'react'

const KEY = 'jvdt.peacepact'
const DEFAULT = { love: false, respect: false, happiness: false, date: new Date().toISOString() }

function read(){
  try{ return JSON.parse(localStorage.getItem(KEY) || JSON.stringify(DEFAULT)) }catch(e){ return DEFAULT }
}

export default function TeachPeace(){
  const [state, setState] = useState(()=>read())

  useEffect(()=>{
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  function toggle(k){ setState(s=>({...s, [k]: !s[k]})) }

  function resetDay(){
    const fresh = { love: false, respect: false, happiness: false, date: new Date().toISOString() }
    setState(fresh)
  }

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Teach Peace</h1>
      <p className="text-sm text-gray-600 mb-4">A small daily practice to affirm peaceful qualities.</p>
      <div className="flex gap-3 mb-4">
        <button onClick={()=>toggle('love')} className={`px-4 py-2 rounded ${state.love? 'bg-green-600 text-white':'border'}`}>Love</button>
        <button onClick={()=>toggle('respect')} className={`px-4 py-2 rounded ${state.respect? 'bg-indigo-600 text-white':'border'}`}>Respect</button>
        <button onClick={()=>toggle('happiness')} className={`px-4 py-2 rounded ${state.happiness? 'bg-yellow-500 text-white':'border'}`}>Happiness</button>
      </div>
      <div className="text-sm text-gray-500 mb-4">Saved: {new Date(state.date).toLocaleDateString()}</div>
      <div className="flex gap-2">
        <button onClick={resetDay} className="px-4 py-2 border rounded">Reset Day</button>
      </div>
    </section>
  )
}
