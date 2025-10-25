import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            JVDT Learning Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover the essence of learning at JVDT Learning Hub, that turns knowledge into wisdom and classrooms into communities of care. 
            We build practical tools for teachers and students using the Four Keys (Association, Analysis, Root, Context) and a simple journey from information to application.
          </p>
          
          {/* Personal Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700"
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 italic">
              "Hi, I'm Johan du Toit. I teach English in Kyiv and build learning tools that help students think clearly, speak bravely, and act kindly. 
              For three decades my family has been involved in education and humanitarian work in Ukraine."
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              JVDT is the fruit of 30 years of pedagogical mission of the Du Toit family in Ukraine.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link 
              to="/keys"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg"
            >
              🔑 Start with Four Keys
            </Link>
            <Link 
              to="/test"
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-lg"
            >
              🧭 Take JVDT Assessment
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          <FeatureCard
            icon="🔑"
            title="Four Keys Framework"
            description="Master the foundations of learning: Association, Analysis, Root principles, and Context understanding."
            link="/keys"
          />
          <FeatureCard
            icon="🚂"
            title="Learning Journey"
            description="Progress through structured stages from Information to Integration, Comprehension, and Application."
            link="/journey"
          />
          <FeatureCard
            icon="🧭"
            title="JVDT Diagnostics"
            description="Discover your learning style and development profile with authentic JVDT assessments."
            link="/test"
          />
          <FeatureCard
            icon="📚"
            title="Resource Library"
            description="Access curated learning materials and generate personalized resources with AI assistance."
            link="/resources"
          />
          <FeatureCard
            icon="📝"
            title="Reflection Studio"
            description="Deepen self-awareness with guided reflection modes, mood tracking, and JVDT-integrated prompts."
            link="/reflect"
          />
          <FeatureCard
            icon="🌟"
            title="Virtue Practice"
            description="Cultivate character through daily practice of seven virtues with micro-actions and progress tracking."
            link="/peace"
          />
        </motion.div>

        {/* About JVDT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
            About the JVDT Framework
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              The Johanson-Van Der Tuin Development Theory is a comprehensive framework for understanding 
              human development across seven key dimensions: <strong>Perception</strong>, <strong>Interpretation</strong>, 
              <strong>Reflection</strong>, <strong>Application</strong>, <strong>Motivation</strong>, 
              <strong>Orientation</strong>, and <strong>Value Expression</strong>.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This learning hub provides practical tools and assessments to help you understand your unique 
              developmental profile, practice virtue-based character development, and engage in meaningful 
              reflection for personal growth.
            </p>
          </div>
          <div className="mt-6 text-center">
            <Link 
              to="/glossary"
              className="inline-flex items-center px-6 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            >
              📖 Explore Glossary
            </Link>
          </div>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Not sure where to start?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/keys"
              className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Begin with the Four Keys
            </Link>
            <Link 
              to="/test/jvdt-2"
              className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Take the Kids Assessment
            </Link>
            <Link 
              to="/reflect"
              className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Start Reflecting
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, link }) {
  return (
    <Link to={link} className="group">
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full"
      >
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
      </motion.div>
    </Link>
  )
}