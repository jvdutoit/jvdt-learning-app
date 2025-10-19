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
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-2xl font-semibold">Four Keys</h1>
      </div>

      <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {keysData.map((key, i) => (
          <motion.article
            key={key.id}
            variants={card}
            whileHover={{ scale: 1.02 }}
            className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="font-semibold text-lg mb-2">{key.name}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
              {key.definition || key.def || key.description}
            </p>

            {Array.isArray(key.practices) && key.practices.length > 0 && (
              <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 mb-2">
                {key.practices.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            )}

            {key.example && (
              <div className="text-xs italic text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Example:</span> {" "}{key.example}
              </div>
            )}
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}