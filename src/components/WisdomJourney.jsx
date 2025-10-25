import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PROGRESS_KEY = 'jvdt.wisdom.progress'
const PRACTICES_KEY = 'jvdt.social.practices'
const REFLECTIONS_KEY = 'jvdt.wisdom.reflections'

// JVDT Wisdom Development Framework
const WISDOM_STAGES = {
  information: {
    name: 'Information Gathering',
    icon: '📚',
    color: 'blue',
    formula: 'Information + Integration = Knowledge',
    description: 'Building foundational understanding through observation and learning',
    skills: [
      {
        name: 'Active Listening',
        practice: 'Listen to understand, not to respond. Paraphrase what you heard.',
        application: 'Practice with a friend or family member for 10 minutes',
        wisdom: 'True understanding begins with genuine attention to others'
      },
      {
        name: 'Perspective Taking',
        practice: 'Before reacting, ask: "What might they be experiencing right now?"',
        application: 'Use this during one disagreement or misunderstanding today',
        wisdom: 'Multiple perspectives create a richer understanding of truth'
      },
      {
        name: 'Cultural Awareness',
        practice: 'Learn about a tradition or viewpoint different from your own',
        application: 'Ask someone about their background or experiences',
        wisdom: 'Diversity expands our capacity for wisdom'
      },
      {
        name: 'Question Formation',
        practice: 'Replace "Why don\'t you..." with "What would help you..."',
        application: 'Use this reframe in three conversations',
        wisdom: 'Better questions lead to better understanding'
      }
    ]
  },
  knowledge: {
    name: 'Knowledge Integration',
    icon: '🧩',
    color: 'green',
    formula: 'Information + Integration = Knowledge',
    description: 'Connecting ideas and experiences into coherent understanding',
    skills: [
      {
        name: 'Empathy Building',
        practice: 'Share a vulnerability appropriately to create connection',
        application: 'Tell someone about a challenge you\'re facing',
        wisdom: 'Vulnerability creates bridges between people'
      },
      {
        name: 'Conflict Navigation',
        practice: 'Focus on interests, not positions. Ask "What do you need?"',
        application: 'Use this approach in one tense situation',
        wisdom: 'Conflict can be a pathway to deeper understanding'
      },
      {
        name: 'Emotional Intelligence',
        practice: 'Name your emotions specifically: frustrated vs. overwhelmed',
        application: 'Practice emotional precision in your daily check-ins',
        wisdom: 'Precise awareness enables precise response'
      },
      {
        name: 'Boundary Setting',
        practice: 'Say no to something that doesn\'t align with your values',
        application: 'Practice one clear, kind boundary this week',
        wisdom: 'Healthy boundaries create space for authentic relationships'
      }
    ]
  },
  wisdom: {
    name: 'Wisdom Application',
    icon: '🌟',
    color: 'purple',
    formula: 'Knowledge + Application = Wisdom',
    description: 'Living with deep understanding and compassionate action',
    skills: [
      {
        name: 'Wise Response',
        practice: 'Pause before reacting. Ask: "What would love do here?"',
        application: 'Use this pause in three challenging moments',
        wisdom: 'Wisdom chooses response over reaction'
      },
      {
        name: 'Leadership Through Service',
        practice: 'Lead by example rather than instruction',
        application: 'Model the behavior you want to see in others',
        wisdom: 'True leadership inspires rather than compels'
      },
      {
        name: 'Restorative Justice',
        practice: 'Focus on healing harm rather than punishment',
        application: 'When someone hurts you, ask what they need to make it right',
        wisdom: 'Restoration builds stronger relationships than retribution'
      },
      {
        name: 'Wisdom Sharing',
        practice: 'Share insights through questions, not lectures',
        application: 'Help someone discover their own answer to a problem',
        wisdom: 'The deepest learning comes from self-discovery'
      }
    ]
  }
}

const SOCIAL_CONTEXTS = [
  { name: 'Family', icon: '👨‍👩‍👧‍👦', situations: ['dinner conversations', 'family conflicts', 'generational differences'] },
  { name: 'Friends', icon: '👥', situations: ['peer pressure', 'friendship boundaries', 'group dynamics'] },
  { name: 'Work/School', icon: '🏫', situations: ['team projects', 'authority relationships', 'performance pressure'] },
  { name: 'Community', icon: '🌍', situations: ['neighborhood interactions', 'civic engagement', 'diversity encounters'] },
  { name: 'Digital', icon: '💻', situations: ['social media conflicts', 'online communities', 'digital communication'] }
]

export default function WisdomJourney() {
  const [activeStage, setActiveStage] = useState('information')
  const [completedPractices, setCompletedPractices] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PRACTICES_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [reflections, setReflections] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(REFLECTIONS_KEY) || '{}')
    } catch {
      return {}
    }
  })
  const [selectedContext, setSelectedContext] = useState('Family')
  const [showReflectionForm, setShowReflectionForm] = useState(false)
  const [currentReflection, setCurrentReflection] = useState('')

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(PRACTICES_KEY, JSON.stringify(completedPractices))
    } catch (e) {}
  }, [completedPractices])

  useEffect(() => {
    try {
      localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections))
    } catch (e) {}
  }, [reflections])

  const togglePractice = (stageKey, skillIndex) => {
    const practiceId = `${stageKey}-${skillIndex}`
    setCompletedPractices(prev => 
      prev.includes(practiceId) 
        ? prev.filter(id => id !== practiceId)
        : [...prev, practiceId]
    )
  }

  const getStageProgress = (stageKey) => {
    const stage = WISDOM_STAGES[stageKey]
    const completed = stage.skills.filter((_, index) => 
      completedPractices.includes(`${stageKey}-${index}`)
    ).length
    return (completed / stage.skills.length) * 100
  }

  const totalProgress = useMemo(() => {
    const stages = Object.keys(WISDOM_STAGES)
    const avgProgress = stages.reduce((sum, stage) => sum + getStageProgress(stage), 0) / stages.length
    return avgProgress
  }, [completedPractices])

  const addReflection = () => {
    if (currentReflection.trim()) {
      const timestamp = new Date().toISOString()
      setReflections(prev => ({
        ...prev,
        [timestamp]: {
          text: currentReflection,
          stage: activeStage,
          context: selectedContext,
          date: new Date().toLocaleDateString()
        }
      }))
      setCurrentReflection('')
      setShowReflectionForm(false)
    }
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 text-white border-blue-600',
      green: 'bg-green-500 text-white border-green-600', 
      purple: 'bg-purple-500 text-white border-purple-600'
    }
    return colors[color] || colors.blue
  }

  const getGradientClasses = (color) => {
    const gradients = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600'
    }
    return gradients[color] || gradients.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 py-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            🌟 The Wisdom Journey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Transform information into wisdom through the JVDT Method. 
            Develop meaningful social skills that create authentic connections and positive impact.
          </p>
          
          {/* JVDT Formulae */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                📚 Information + 🧩 Integration = 🧠 Knowledge
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Gather diverse perspectives and connect them into deeper understanding
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                🧠 Knowledge + 🎯 Application = 🌟 Wisdom
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Apply understanding through compassionate action and service
              </p>
            </motion.div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Wisdom Journey Progress</h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(totalProgress)}% Complete • {completedPractices.length} Practices Mastered
            </p>
          </div>
        </motion.div>

        {/* Stage Selection */}
        <div className="flex flex-wrap justify-center gap-4">
          {Object.entries(WISDOM_STAGES).map(([key, stage]) => (
            <motion.button
              key={key}
              onClick={() => setActiveStage(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                activeStage === key 
                  ? getColorClasses(stage.color)
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{stage.icon}</span>
                <div className="text-left">
                  <div>{stage.name}</div>
                  <div className="text-xs opacity-75">
                    {Math.round(getStageProgress(key))}% Complete
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Active Stage Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Stage Header */}
            <div className={`bg-gradient-to-r ${getGradientClasses(WISDOM_STAGES[activeStage].color)} rounded-xl p-8 text-white`}>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl">{WISDOM_STAGES[activeStage].icon}</span>
                <div>
                  <h2 className="text-3xl font-bold">{WISDOM_STAGES[activeStage].name}</h2>
                  <p className="text-xl opacity-90">{WISDOM_STAGES[activeStage].formula}</p>
                </div>
              </div>
              <p className="text-lg opacity-90">{WISDOM_STAGES[activeStage].description}</p>
              
              {/* Stage Progress */}
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div 
                    className="bg-white h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getStageProgress(activeStage)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <p className="text-sm mt-2 opacity-75">
                  {WISDOM_STAGES[activeStage].skills.filter((_, index) => 
                    completedPractices.includes(`${activeStage}-${index}`)
                  ).length} of {WISDOM_STAGES[activeStage].skills.length} skills developed
                </p>
              </div>
            </div>

            {/* Social Context Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                🎭 Practice Context: Where will you apply these skills?
              </h3>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_CONTEXTS.map(context => (
                  <button
                    key={context.name}
                    onClick={() => setSelectedContext(context.name)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedContext === context.name
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="mr-2">{context.icon}</span>
                    {context.name}
                  </button>
                ))}
              </div>
              
              {selectedContext && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Common {selectedContext} situations:</strong>{' '}
                    {SOCIAL_CONTEXTS.find(c => c.name === selectedContext)?.situations.join(', ')}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Skills Practice Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {WISDOM_STAGES[activeStage].skills.map((skill, index) => {
                const practiceId = `${activeStage}-${index}`
                const isCompleted = completedPractices.includes(practiceId)
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 transition-all duration-200 ${
                      isCompleted 
                        ? 'border-green-400 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {skill.name}
                      </h4>
                      <button
                        onClick={() => togglePractice(activeStage, index)}
                        className={`p-2 rounded-full transition-all ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {isCompleted ? '✓' : '○'}
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Practice:</p>
                        <p className="text-blue-700 dark:text-blue-200">{skill.practice}</p>
                      </div>
                      
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-1">
                          Application in {selectedContext}:
                        </p>
                        <p className="text-orange-700 dark:text-orange-200">{skill.application}</p>
                      </div>
                      
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">Wisdom Insight:</p>
                        <p className="text-purple-700 dark:text-purple-200 italic">"{skill.wisdom}"</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Reflection Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              💭 Wisdom Reflections
            </h3>
            <button
              onClick={() => setShowReflectionForm(!showReflectionForm)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              {showReflectionForm ? 'Cancel' : 'Add Reflection'}
            </button>
          </div>

          {showReflectionForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <textarea
                value={currentReflection}
                onChange={(e) => setCurrentReflection(e.target.value)}
                placeholder="What insights have you gained? How did applying these skills feel? What would you do differently?"
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
              />
              <div className="flex justify-end mt-3 space-x-2">
                <button
                  onClick={() => setShowReflectionForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addReflection}
                  disabled={!currentReflection.trim()}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save Reflection
                </button>
              </div>
            </motion.div>
          )}

          {/* Recent Reflections */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(reflections)
              .sort(([a], [b]) => new Date(b) - new Date(a))
              .slice(0, 5)
              .map(([timestamp, reflection]) => (
                <motion.div
                  key={timestamp}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{WISDOM_STAGES[reflection.stage]?.icon}</span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {reflection.stage} • {reflection.context} • {reflection.date}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{reflection.text}</p>
                </motion.div>
              ))}
            
            {Object.keys(reflections).length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No reflections yet. Start your wisdom journey by adding your first reflection!
              </p>
            )}
          </div>
        </div>

        {/* Achievement Section */}
        {totalProgress > 50 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-2">🎉 Wisdom Seeker Achievement!</h3>
            <p className="text-lg">
              You've completed over half of your wisdom journey. You're developing real social wisdom!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}