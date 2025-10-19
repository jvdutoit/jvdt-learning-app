import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function TopNav() {
  const loc = useLocation()
  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-slate-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="font-semibold">JVDT Learning</div>
          <nav className="flex gap-2">
            <Link to="/keys" className={`px-3 py-1 rounded-lg text-sm ${loc.pathname === '/keys' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200'}`}>
              Four Keys
            </Link>
            <Link to="/journey" className={`px-3 py-1 rounded-lg text-sm ${loc.pathname === '/journey' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200'}`}>
              Train Journey
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
