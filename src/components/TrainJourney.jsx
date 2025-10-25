import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import pillarsData from '../data/pillars.json'

const TRAIN_STATIONS = [
  { 
    order: 1, 
    name: 'Information',
    icon: '📚',
    description: 'Gathering facts, data, and raw material for learning.',
    color: 'blue'
  },
  { 
    order: 2, 
    name: 'Integration',
    icon: '🔗',
    description: 'Connecting new information with existing knowledge and experience.',
    color: 'green'
  },
  { 
    order: 3, 
    name: 'Comprehension',
    icon: '💡',
    description: 'Deep understanding and ability to explain concepts clearly.',
    color: 'amber'
  },
  { 
    order: 4, 
    name: 'Application',
    icon: '🎯',
    description: 'Using knowledge to solve problems and create value in the world.',
    color: 'purple'
  },
]

const STORAGE_KEY = 'jvdt.train.progress'

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  green: {
    bg: 'bg-green-500', 
    bgLight: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    button: 'bg-green-600 hover:bg-green-700'
  },
  amber: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-50 dark:bg-amber-950', 
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    button: 'bg-amber-600 hover:bg-amber-700'
  },
  purple: {
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-50 dark:bg-purple-950',
    border: 'border-purple-200 dark:border-purple-800', 
    text: 'text-purple-700 dark:text-purple-300',
    button: 'bg-purple-600 hover:bg-purple-700'
  }
}

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
  const currentStation = TRAIN_STATIONS.find(s => s.order === step)
  const stationPillars = pillarsData.filter(pillar => 
    pillar.stations && pillar.stations.includes(currentStation?.name)
  )

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Journey</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Navigate through the four stations of deep learning and understanding
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
          <div 
            className="h-3 bg-gradient-to-r from-blue-500 via-green-500 via-amber-500 to-purple-500 transition-all duration-500" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
        <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
          Station {step} of {TRAIN_STATIONS.length} • {Math.round(progressPercent)}% Complete
        </div>
      </div>

      {/* Station Buttons */}
      <div className="flex items-center justify-between gap-4 mb-8">
        {TRAIN_STATIONS.map((s) => {
          const active = s.order === step
          const completed = s.order < step
          const colors = colorClasses[s.color]
          
          return (
            <motion.button
              key={s.order}
              onClick={() => goto(s.order)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                active 
                  ? `${colors.bgLight} ${colors.border} border-2 ${colors.text}` 
                  : completed
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl ${
                active 
                  ? `${colors.bg} text-white shadow-lg` 
                  : completed
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
              }`}>
                {completed && !active ? '✓' : s.icon}
              </div>
              <div className="text-sm font-medium text-center">
                <div>{s.name}</div>
                <div className="text-xs opacity-75 mt-1 hidden sm:block max-w-20">
                  {s.order === step ? 'Current' : completed ? 'Complete' : 'Upcoming'}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Current Station Detail */}
      {currentStation && (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`${colorClasses[currentStation.color].bgLight} ${colorClasses[currentStation.color].border} border-2 rounded-2xl p-6 mb-8`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full ${colorClasses[currentStation.color].bg} text-white text-2xl flex items-center justify-center`}>
              {currentStation.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Station {currentStation.order}: {currentStation.name}
              </h2>
              <p className={`${colorClasses[currentStation.color].text} font-medium`}>
                {currentStation.description}
              </p>
            </div>
          </div>

          {stationPillars.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Key Concepts for this Station
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stationPillars.map((pillar) => (
                  <div
                    key={pillar.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {pillar.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {pillar.summary}
                    </p>
                    {pillar.prompt && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 italic">
                        💭 {pillar.prompt}
                      </div>
                    )}
                    {pillar.microTask && (
                      <div className="text-xs mt-2 text-blue-600 dark:text-blue-400">
                        🎯 {pillar.microTask}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button 
          onClick={prev} 
          disabled={step === 1}
          className="px-6 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous Station
        </button>
        
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Progress saved automatically
          </div>
        </div>

        <button 
          onClick={next} 
          disabled={step === TRAIN_STATIONS.length}
          className={`px-6 py-3 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            currentStation ? colorClasses[currentStation.color].button : 'bg-gray-500'
          }`}
        >
          Next Station →
        </button>
      </div>
    </section>
  )
}

