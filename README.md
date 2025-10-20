# JVDT Learning Hub

[![CI](https://github.com/jvdutoit/jvdt-learning-app/actions/workflows/ci.yml/badge.svg)](https://github.com/jvdutoit/jvdt-learning-app/actions/workflows/ci.yml)

Vite + React + Tailwind + Framer Motion. Pages: **Keys**, **Journey**, **Glossary**, **Reflection (CAGE)**, **Teach Peace**.

## Quick Start
```bash
npm i
npm run dev
# prod
npm run build && npm run preview
```

## LocalStorage Keys
- `jvdt.reflection.draft` – live draft string
- `jvdt.reflections` – saved entries array
- `jvdt.peacepact` – per-day object `{ YYYY-MM-DD: { love, respect, happiness } }`

## Tests
```bash
npm run test
npm run test:run
```

## Deployment (Vercel)
Import this repo into Vercel → Framework: **Vite** → Build: `npm run build` → Output: `dist/`. SPA rewrites are configured via `vercel.json`.
