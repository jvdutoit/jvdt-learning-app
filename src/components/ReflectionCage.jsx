import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'jvdt.reflections'
const DRAFT_KEY = 'jvdt.reflection.draft'
const SETTINGS_KEY = 'jvdt.reflection.settings'

// JVDT-based reflection prompts
const REFLECTION_PROMPTS = {
  perception: [
    "What patterns did you notice today that you hadn't seen before?",
    "How did your initial impressions change as you gathered more information?",
    "What details stood out to you, and what might you have overlooked?",
    "How did you balance seeing the big picture with noticing specifics?"
  ],
  interpretation: [
    "What foundational principles guided your decisions today?",
    "How did you adapt your understanding to different contexts?",
    "When did you rely on established truths vs. situational flexibility?",
    "What meaning did you find in today's experiences?"
  ],
  reflection: [
    "What insights came from quiet contemplation vs. discussing with others?",
    "How did your internal processing and external dialogue complement each other?",
    "What did you learn about your own thinking patterns?",
    "How has your understanding deepened through reflection?"
  ],
  application: [
    "How did you balance visionary thinking with practical action today?",
    "What big dreams moved closer to reality through small steps?",
    "Where did pragmatic planning serve your larger goals?",
    "How did you organize your actions around your deeper purposes?"
  ],
  motivation: [
    "What energized you most in your work and relationships today?",
    "How did you balance personal fulfillment with serving others?",
    "What values drove your most important decisions?",
    "Where did you find meaning in today's challenges?"
  ],
  orientation: [
    "How did you balance immediate tasks with long-term vision?",
    "What seasonal patterns or larger rhythms did you notice?",
    "How did today's activities connect to your bigger life themes?",
    "Where did you find the right pace between urgency and patience?"
  ],
  valueExpression: [
    "How did you express love in your interactions today?",
    "Where did you show respect for others' dignity and worth?",
    "What brought you genuine happiness or peace?",
    "How did your actions reflect your deepest values?"
  ]
}

const REFLECTION_MODES = {
  freeform: {
    name: "Free-form",
    description: "Write whatever comes to mind",
    icon: "✍️",
    placeholder: "What did you notice? What changed? What are you thinking about?"
  },
  jvdt: {
    name: "JVDT Guided",
    description: "Structured reflection on the 7 axes of development",
    icon: "🎯",
    placeholder: "Reflect on today through the lens of the JVDT framework..."
  },
  gratitude: {
    name: "Gratitude",
    description: "Focus on appreciation and positive moments",
    icon: "🙏",
    placeholder: "What are you grateful for today? What brought you joy or peace?"
  },
  learning: {
    name: "Learning Review",
    description: "Capture insights, lessons, and growth",
    icon: "📚",
    placeholder: "What did you learn today? How did you grow or change?"
  },
  challenge: {
    name: "Challenge Reflection",
    description: "Process difficulties and find wisdom in struggles",
    icon: "💪",
    placeholder: "What challenged you today? How did you respond? What did you discover?"
  }
}

function readAll(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }catch(e){ return [] }
}

function readSettings(){
  try{ return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }catch(e){ return {} }
}

function writeSettings(settings){
  try{ localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)) }catch(e){}
}

export default function ReflectionCage({ autosaveMs = 1200 }){
  const [text, setText] = useState('')
  const [entries, setEntries] = useState(()=>readAll())
  const [status, setStatus] = useState('')
  const [currentMode, setCurrentMode] = useState('freeform')
  const [currentPrompt, setCurrentPrompt] = useState(null)
  const [showPrompts, setShowPrompts] = useState(false)
  const [mood, setMood] = useState(3) // 1-5 scale
  const [settings, setSettings] = useState(()=>readSettings())
  const timeoutRef = useRef(null)

  // restore draft on mount
  useEffect(()=>{
    const draft = localStorage.getItem(DRAFT_KEY)
    if(draft){
      try{ 
        const parsed = JSON.parse(draft)
        setText(parsed.text || '') 
        setCurrentMode(parsed.mode || 'freeform')
        setMood(parsed.mood || 3)
      }catch(e){}
    }
  }, [])

  // debounced autosave: saves draft after user stops typing for ~1200ms
  useEffect(()=>{
    if(timeoutRef.current) window.clearTimeout(timeoutRef.current)
    if(!text.trim()) return
    timeoutRef.current = window.setTimeout(()=>{
      try{
        const draft = { 
          id: 'draft', 
          text, 
          mode: currentMode,
          mood,
          createdAt: new Date().toISOString() 
        }
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
        setStatus('Draft saved')
        window.setTimeout(()=>setStatus(''), 1200)
      }catch(e){}
    }, autosaveMs)
    return ()=>{
      if(timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [text, currentMode, mood, autosaveMs])

  // Update settings when changed
  useEffect(() => {
    writeSettings(settings)
  }, [settings])

  function getRandomPrompt() {
    const axisPrompts = REFLECTION_PROMPTS[Math.random() > 0.5 ? 'perception' : Object.keys(REFLECTION_PROMPTS)[Math.floor(Math.random() * Object.keys(REFLECTION_PROMPTS).length)]]
    return axisPrompts[Math.floor(Math.random() * axisPrompts.length)]
  }

  function generateJVDTPrompts() {
    const prompts = []
    Object.entries(REFLECTION_PROMPTS).forEach(([axis, questions]) => {
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
      prompts.push(`${axis.charAt(0).toUpperCase() + axis.slice(1)}: ${randomQuestion}`)
    })
    return prompts
  }

  function insertPrompt(prompt) {
    const separator = text.trim() ? '\n\n' : ''
    setText(prev => prev + separator + prompt + '\n\n')
    setCurrentPrompt(null)
  }

  function save(){
    if(!text.trim()) return
    const next = readAll()
    const entry = { 
      id: crypto.randomUUID(), 
      text: text.trim(), 
      mode: currentMode,
      mood,
      createdAt: new Date().toISOString() 
    }
    next.unshift(entry)
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }catch(e){}
    setEntries(next)
    setText('')
    setMood(3) // reset mood
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

  function getMoodEmoji(moodValue) {
    const moods = ['😔', '😐', '🙂', '😊', '🌟']
    return moods[moodValue - 1] || '🙂'
  }

  function getMoodLabel(moodValue) {
    const labels = ['Struggling', 'Neutral', 'Good', 'Great', 'Excellent']
    return labels[moodValue - 1] || 'Good'
  }

  const charCount = text.length
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const currentModeData = REFLECTION_MODES[currentMode]

  return (
    <section className="min-h-[60vh] flex items-start justify-center py-8 bg-gradient-to-br from-rose-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold mb-2">Guided Reflection Studio</h1>
          <p className="text-gray-600 dark:text-gray-400">Deepen your self-awareness with structured reflection</p>
        </div>

        {/* Reflection Mode Selector */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Reflection Mode</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {Object.entries(REFLECTION_MODES).map(([key, mode]) => (
              <button
                key={key}
                onClick={() => setCurrentMode(key)}
                className={`p-3 rounded-lg text-center transition-all ${
                  currentMode === key
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border hover:border-indigo-300'
                }`}
              >
                <div className="text-xl mb-1">{mode.icon}</div>
                <div className="text-xs font-medium">{mode.name}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{currentModeData.description}</p>
        </div>

        {/* JVDT Prompts Section */}
        {currentMode === 'jvdt' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-blue-900 dark:text-blue-200">JVDT Framework Prompts</h4>
              <button
                onClick={() => setShowPrompts(!showPrompts)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showPrompts ? 'Hide Prompts' : 'Show Prompts'}
              </button>
            </div>
            
            <AnimatePresence>
              {showPrompts && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {generateJVDTPrompts().map((prompt, index) => (
                    <div key={index} className="text-sm bg-white dark:bg-gray-800 p-3 rounded border">
                      <button
                        onClick={() => insertPrompt(prompt)}
                        className="text-left w-full hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {prompt}
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Quick Prompt Button for other modes */}
        {currentMode !== 'jvdt' && (
          <div className="mb-4 text-center">
            <button
              onClick={() => insertPrompt(getRandomPrompt())}
              className="text-sm px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
            >
              ✨ Add reflection prompt
            </button>
          </div>
        )}

        {/* Mood Selector */}
        <div className="mb-4">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Mood:</span>
            {[1,2,3,4,5].map(value => (
              <button
                key={value}
                onClick={() => setMood(value)}
                className={`text-2xl transition-transform hover:scale-110 ${
                  mood === value ? 'scale-125' : 'opacity-50 hover:opacity-75'
                }`}
              >
                {getMoodEmoji(value)}
              </button>
            ))}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getMoodLabel(mood)}
            </span>
          </div>
        </div>

        {/* Enhanced Textarea */}
        <motion.textarea
          aria-label="Reflection Journal"
          id="reflection-text"
          value={text}
          onChange={e=>setText(e.target.value)}
          rows={12}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full p-4 border rounded-lg mb-3 bg-white dark:bg-gray-800 outline-none transition-all focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-indigo-400 text-gray-900 dark:text-gray-100 resize-none"
          placeholder={currentModeData.placeholder}
          aria-describedby="reflection-stats"
        />

        {/* Stats and Status */}
        <div id="reflection-stats" className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <span>Characters: {charCount}</span>
            <span>Words: {wordCount}</span>
            <span className="flex items-center">
              Mode: <span className="ml-1 font-medium">{currentModeData.icon} {currentModeData.name}</span>
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-300">{status}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button 
            data-testid="reflection-save" 
            onClick={save} 
            disabled={!text.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
          >
            💾 Save Reflection
          </button>
          <button 
            data-testid="reflection-clear-draft" 
            onClick={()=>{ if(confirm('Discard current draft?')) { setText(''); setMood(3) } }} 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 transition-colors"
          >
            🗑️ Clear Draft
          </button>
          <button 
            data-testid="reflection-export" 
            onClick={() => {
              try{
                const exportData = {
                  reflections: entries,
                  exportedAt: new Date().toISOString(),
                  totalEntries: entries.length
                }
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `jvdt-reflections-${new Date().toISOString().slice(0,10)}.json`
                document.body.appendChild(a)
                a.click()
                a.remove()
                URL.revokeObjectURL(url)
              }catch(e){ console.warn('export failed', e) }
            }} 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 transition-colors text-sm"
          >
            📄 Export
          </button>
          <button 
            data-testid="reflection-clear-all" 
            onClick={clearJournal} 
            className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors text-sm"
          >
            🗑️ Clear All
          </button>
        </div>

        {/* Reflection Analytics */}
        {entries.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {entries.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Reflections</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(entries.reduce((sum, e) => sum + (e.text?.split(/\s+/).length || 0), 0) / entries.length) || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Words</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl">
                {entries.length > 0 && entries.filter(e => e.mood).length > 0 
                  ? getMoodEmoji(Math.round(entries.filter(e => e.mood).reduce((sum, e) => sum + e.mood, 0) / entries.filter(e => e.mood).length))
                  : '🙂'
                }
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Mood</div>
            </div>
          </div>
        )}

        {/* Saved Reflections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Reflection History ({entries.length})
            </h2>
            {entries.length > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last entry: {new Date(entries[0]?.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
          
          {entries.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-gray-500 dark:text-gray-400 mb-1">No reflections yet</div>
              <div className="text-sm text-gray-400 dark:text-gray-500">Start by choosing a reflection mode above</div>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map(entry => (
                <motion.article 
                  key={entry.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{new Date(entry.createdAt).toLocaleString()}</span>
                      {entry.mode && (
                        <span className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                          {REFLECTION_MODES[entry.mode]?.icon || '✍️'} {REFLECTION_MODES[entry.mode]?.name || 'Free-form'}
                        </span>
                      )}
                      {entry.mood && (
                        <span className="flex items-center">
                          {getMoodEmoji(entry.mood)} {getMoodLabel(entry.mood)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {entry.text?.split(/\s+/).length || 0} words
                    </div>
                  </div>
                  <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {entry.text}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
