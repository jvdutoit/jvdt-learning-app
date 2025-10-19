import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const TRAIN_STATIONS = [
  { order: 1, name: 'Information' },
  { order: 2, name: 'Integration' },
  { order: 3, name: 'Comprehension' },
  { order: 4, name: 'Application' },
]

const STORAGE_KEY = 'jvdt.train.progress'

export default function TrainJourney() {
  const [step, setStep] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? Number(raw) : 1
    } catch {
      return 1
    }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(step)) } catch {}
  }, [step])

  const next = () => setStep((s) => Math.min(s + 1, TRAIN_STATIONS.length))
  const prev = () => setStep((s) => Math.max(s - 1, 1))
  const goto = (n) => setStep(n)

  const progressPercent = ((step - 1) / (TRAIN_STATIONS.length - 1)) * 100

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Train Journey</h1>

      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <div className="h-2 bg-emerald-500 transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        {TRAIN_STATIONS.map((s) => {
          const active = s.order === step
          return (
            <motion.button
              key={s.order}
              onClick={() => goto(s.order)}
              whileHover={{ scale: 1.03 }}
              className={`flex flex-col items-center gap-2 focus:outline-none ${active ? 'text-emerald-700' : 'text-gray-700 dark:text-gray-200'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}>
                {s.order}
              </div>
              <div className="text-xs hidden sm:block">{s.name}</div>
            </motion.button>
          )
        })}
      </div>

      <div className="flex gap-2">
        <button onClick={prev} className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800">Back</button>
        <button onClick={next} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Next</button>
      </div>
    </section>
  )
}

