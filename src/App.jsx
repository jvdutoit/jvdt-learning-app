import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import FourKeys from './components/FourKeys';
import TrainJourney from './components/TrainJourney';
import Glossary from './components/Glossary';
import ReflectionCage from './components/ReflectionCage';
import TeachPeace from './components/TeachPeace';

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || localStorage.getItem('jvdt:theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try{ localStorage.setItem('theme', theme); }catch(e){}
  }, [theme]);

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      className="px-3 py-1 rounded-md border"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}

function TopNav() {
  const loc = useLocation();
  return (
    <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-slate-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-semibold">JVDT Learning Hub</span>
          <nav className="flex gap-2">
            <Link to="/keys" className={`px-3 py-1 rounded-lg text-sm ${loc.pathname === '/keys' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200'}`}>
              Keys
            </Link>
            <Link to="/journey" className={`px-3 py-1 rounded-lg text-sm ${loc.pathname === '/journey' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200'}`}>
              Journey
            </Link>
            <Link to="/glossary" className={`px-3 py-1 rounded-lg text-sm ${loc.pathname === '/glossary' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200'}`}>
              Glossary
            </Link>
            <Link to="/reflect" className={`px-3 py-1 rounded-lg text-sm ${loc.pathname === '/reflect' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200'}`}>
              Reflect
            </Link>
            <Link to="/peace" className={`px-3 py-1 rounded-lg text-sm ${loc.pathname === '/peace' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200'}`}>
              Peace Pact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/keys" replace />} />
          <Route path="/keys" element={<FourKeys />} />
          <Route path="/journey" element={<TrainJourney />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/reflect" element={<ReflectionCage />} />
          <Route path="/peace" element={<TeachPeace />} />
        </Routes>
      </main>
    </>
  )
}
