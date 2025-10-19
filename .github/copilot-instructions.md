Project: JVDT Learning App — Vite + React + Tailwind (prototype)

Goal for AI coding agents
- Make small, safe improvements to the single-page prototype: bug fixes, UI tweaks, accessibility, small features that follow existing patterns.
- Avoid large architectural rewrites: this is a compact prototype where data lives in localStorage and UI is in a single React component tree.

Quick orientation (files to open first)
- `README.md` — local dev commands: `npm install` then `npm run dev` (Vite). Use `npm run build` and `npm run preview` for production build/preview.
- `package.json` — scripts and dependencies (Vite, React, Tailwind, framer-motion).
- `src/App.jsx` — the main app and almost all UI logic: routing (route state), store (usePersistedState → localStorage), screens (Home, Method, Journey, Reflection, TeachPeace, Glossary). Most edits will be here.
- `src/main.jsx` — React entry; loads `App` and `index.css`.
- `src/data/keys.json` and `src/data/pillars.json` — seed data and canonical shapes for keys/pillars.

Big-picture architecture (short)
- Single-page React prototype using Vite. There is no backend: app state persists to localStorage via `usePersistedState` in `src/App.jsx`.
- Navigation is driven by a local `route` state in `App` (string keys in `NAV`), not React Router. Screens are switched via conditional rendering.
- Styling uses Tailwind and utility classes directly in JSX. Animations use `framer-motion`'s `AnimatePresence` + `motion.div`.

Important project-specific patterns
- Persisted store: `usePersistedState(key, initial)` reads/writes JSON to `localStorage`. When adding data, functions generate `id` with `crypto.randomUUID()` and set createdAt with `new Date().toISOString()`.
- Data shapes: inspect `src/data/*.json` for expected fields (e.g., pillars have `id`, `title`, `domain`, `stations`, `related_keys`). New code should match these shapes.
- Routing: change `route` state to switch screens. New routes must be added to `NAV` and handled in the main JSX switch.
- UI primitives: small helper components (`Section`, `Chip`, `Pill`, `Button`) are defined at top of `App.jsx` — reuse them for consistent appearance.
- No TypeScript present; JS/JSX only. Keep edits simple and avoid adding build-time type toolchains.

Developer workflows and commands
- Local dev: `npm install` then `npm run dev` (Vite serves at localhost, usually :5173). See `README.md`.
- Build: `npm run build` then `npm run preview`.
- Tailwind: configured via `tailwind.config.js` and `postcss.config.js`. Editing classes in JSX is the normal pattern; there is no separate CSS components system beyond `src/index.css`.

Safety & scope guidelines for AI edits
- Prefer changes contained to `src/` and small changes to `index.html` or `package.json` only when necessary (e.g., adding a small script). Avoid refactors that introduce new dependencies.
- Keep UI state behavior unchanged unless fixing a clear bug (e.g., missing dependency arrays, uncontrolled inputs). Preserve existing data keys and localStorage keys (`jvdt:journeys`, `jvdt:reflections`, `jvdt:agreements`).
- Avoid network calls or secrets. There is currently no server integration; do not add fetch logic unless the user requests it and provides an API contract.

Examples of safe, high-value edits
- Add a small accessibility improvement to a form field in `Journey` (label association or `aria-*`).
- Extract a repeated small component (e.g., a labeled input) inside `src/App.jsx` to reduce duplication.
- Fix a UX bug such as missing form reset after save (follow existing patterns used in `onSave` handlers).

Edge cases and gotchas
- LocalStorage failures: `usePersistedState` swallows JSON errors — when debugging persistence issues, check browser console/storage. Tests are manual; there are no automated tests in the repo.
- Routing is not URL-driven. Bookmarking or direct linking won't work unless `route` handling is extended to read/write location hash.
- JSON data shapes in `src/data` are authoritative — changing them requires updating rendering logic across screens.

Where to look for more context
- `src/App.jsx` — primary implementation and best source of patterns/examples.
- `src/data/` — canonical data shapes to follow.
- `README.md` — local workflows and commands.

If you need a decision from the human
- Ask before: adding new runtime dependencies, introducing persistent backend calls, changing data localStorage keys, or enabling URL-based routing.

End of instructions — ask me (the repo owner) if any part is unclear or if you want a different scope (tests, API, or major refactor).
