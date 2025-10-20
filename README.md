# JVDT Learning Hub
Vite + React + Tailwind + Framer Motion. A learning prototype implementing the Four Keys of Understanding, the Train Journey, a searchable Glossary, a Reflection (CAGE) journal, and a Teach Peace daily pact.

## Demo
_(add a screenshot or deployment URL here)_

## Features
- **Keys** — Association, Analysis, Root, Context (JSON-driven)
- **Journey** — Information → Integration → Comprehension → Application (progress + localStorage)
- **Glossary** — 60+ pedagogical terms with search, filters, and a detail drawer (deep links)
- **Reflection (CAGE)** — autosave draft, counters, export JSON
- **Teach Peace** — daily toggles: Love · Respect · Happiness

## Tech Stack
- Vite + React 18
- Tailwind CSS
- Framer Motion
- React Router DOM
- Vitest + Testing Library

## Routes
- `/keys` — Four Keys
- `/journey` — Train Journey
- `/glossary` — Glossary + drawer (`?term=slug` deep links)
- `/reflect` — Reflection (CAGE)
- `/peace` — Teach Peace Pact

## Getting Started
```bash
npm i
npm run dev
# production
npm run build && npm run preview
```
