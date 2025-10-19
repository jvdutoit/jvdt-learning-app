import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

const KEY = 'jvdt.peacepact'

function readAll(){
  try{ return JSON.parse(localStorage.getItem(KEY) || '{}') }catch(e){ return {} }
}

function writeAll(obj){
  try{ localStorage.setItem(KEY, JSON.stringify(obj)) }catch(e){ }
}

function todayISO(){
  return new Date().toISOString().slice(0,10)
}

export default function TeachPeace(){
  const date = todayISO()
  const all = useMemo(() => readAll(), [])
  const initial = all[date] || { love: false, respect: false, happiness: false }

  const [pact, setPact] = useState(initial)

  // persist whenever pact changes
  useEffect(()=>{
    const next = readAll()
    next[date] = pact
    writeAll(next)
  }, [pact, date])

  function toggle(key){
    setPact(p => ({ ...p, [key]: !p[key] }))
  }

  function resetDay(){
    if(!confirm('Reset today\'s Peace Pact?')) return
    const next = readAll()
    delete next[date]
    writeAll(next)
    setPact({ love: false, respect: false, happiness: false })
  }

  const complete = pact.love && pact.respect && pact.happiness

  return (
    <section className="min-h-[60vh] flex items-start justify-center py-12 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-gray-800 dark:to-gray-900">
      <div className="w-full max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-semibold mb-3">Teach Peace Pact</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Affirm your practice each day by toggling the qualities you bring.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button aria-pressed={!!pact.love} onClick={() => toggle('love')} className={`rounded-xl px-6 py-6 text-white focus:outline-none focus:ring-4 focus:ring-pink-300 transform transition hover:brightness-105 ${pact.love ? 'bg-pink-500' : 'bg-white dark:bg-gray-700 border'}`}>
            <div className="text-xl font-semibold">Love</div>
          </button>

          <button aria-pressed={!!pact.respect} onClick={() => toggle('respect')} className={`rounded-xl px-6 py-6 text-white focus:outline-none focus:ring-4 focus:ring-yellow-300 transform transition hover:brightness-105 ${pact.respect ? 'bg-yellow-500' : 'bg-white dark:bg-gray-700 border'}`}>
            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">Respect</div>
          </button>

          <button aria-pressed={!!pact.happiness} onClick={() => toggle('happiness')} className={`rounded-xl px-6 py-6 text-white focus:outline-none focus:ring-4 focus:ring-green-300 transform transition hover:brightness-105 ${pact.happiness ? 'bg-green-500' : 'bg-white dark:bg-gray-700 border'}`}>
            <div className="text-xl font-semibold">Happiness</div>
          </button>
        </div>

        <div className="mb-4">
          <button onClick={resetDay} className="px-4 py-2 border rounded focus:outline-none focus:ring-2">Reset Day</button>
        </div>

        {complete && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="mt-4 inline-block bg-white/80 dark:bg-gray-800/70 px-4 py-2 rounded">
            <strong>Peace Pact complete for today!</strong>
          </motion.div>
        )}
      </div>
    </section>
  )
}
