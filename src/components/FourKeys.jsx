import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import keysData from '../data/keys.json';

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const card = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } },
};

export default function FourKeys() {
  return (
    <section className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">The Four Keys to Learning Mastery</h1>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
          <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">Unlocking the JVDT Method</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
            The JVDT Learning App is built on a fundamental understanding: <strong>true learning transforms information into wisdom through systematic integration and application</strong>. These Four Keys are the master tools that unlock this transformation process.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">The JVDT Formula I</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">Information + Integration = Knowledge</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">The JVDT Formula II</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">Knowledge + Application = Wisdom</div>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Each key represents a cognitive strategy that moves learners from passive consumption to active transformation. 
            Together, they form a holistic framework that develops critical thinking, emotional intelligence, and practical wisdom—
            the three pillars essential for navigating our complex, interconnected world.
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <div className="text-amber-600 dark:text-amber-400 text-xl">💡</div>
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">How to Use These Keys</h3>
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                Think of each key as a lens through which to examine any learning challenge. Apply them individually or in combination 
                to unlock deeper understanding, make meaningful connections, and develop wisdom that transcends subject boundaries.
              </p>
            </div>
          </div>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {keysData.map((key, i) => (
          <motion.article
            key={key.id}
            variants={card}
            whileHover={{ scale: 1.02 }}
            className="border rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {i + 1}
              </div>
              <h2 className="font-bold text-xl text-gray-900 dark:text-white">{key.name}</h2>
            </div>
            
            <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
              {key.definition || key.def || key.description}
            </p>

            {Array.isArray(key.practices) && key.practices.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">🔧 Key Practices:</h4>
                <div className="flex flex-wrap gap-2">
                  {key.practices.map((p, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {key.example && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border-l-4 border-indigo-500">
                <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">💡 EXAMPLE IN ACTION</div>
                <div className="text-sm text-gray-700 dark:text-gray-200 italic">
                  {key.example}
                </div>
              </div>
            )}
          </motion.article>
        ))}
      </motion.div>

      <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">🎯 The Holistic Learning Journey</h3>
        
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 font-bold">1</span>
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Associate</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Connect & Bridge</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Analyze</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Examine & Compare</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Root</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Discover Essence</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <span className="text-orange-600 dark:text-orange-400 font-bold">4</span>
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Context</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Apply & Adapt</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600 mb-4">
          <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
            <strong>Together, these keys form a complete learning ecosystem:</strong> They guide learners from initial understanding 
            (Association) through deep comprehension (Analysis & Root) to meaningful application (Context). This holistic approach 
            ensures that learning becomes transformative—not just informational—developing the wisdom needed for real-world impact.
          </p>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
            🚀 Ready to begin your learning journey? Explore the other sections to apply these keys in action!
          </div>
        </div>
      </div>
    </section>
  );
}