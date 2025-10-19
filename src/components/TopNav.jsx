import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'light' } catch { return 'light' }
  })

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme)
    } catch {}
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <button aria-label="Toggle theme" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-3 py-1 rounded-md border">
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}

export default function TopNav() {
  const loc = useLocation()

  // Ensure theme is applied on mount (in case App didn't run ThemeToggle yet)
  useEffect(() => {
    try {
      const t = localStorage.getItem('theme') || 'light'
      document.documentElement.classList.toggle('dark', t === 'dark')
    } catch {}
  }, [])

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
            <Link to="/glossary" className={`px-3 py-1 rounded-lg text-sm ${loc.pathname === '/glossary' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200'}`}>
              Glossary
            </Link>
            <Link to="/reflect" className={`px-3 py-1 rounded-lg text-sm ${loc.pathname === '/reflect' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200'}`}>
              Reflect
            </Link>
            <Link to="/peace" className={`px-3 py-1 rounded-lg text-sm ${loc.pathname === '/peace' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200'}`}>
              Teach Peace
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
