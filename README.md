# JVDT Learning App (Vite + React + Tailwind)

[![CI](https://github.com/your-username/jvdt-learning-app/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/jvdt-learning-app/actions/workflows/ci.yml)

A working prototype of the JVDT Learning Hub featuring:
- Method map (Four Keys, Train Journey, Twenty Pillars)
- Journey Builder (4 stations, Keys, Pillars, metric)
- Reflection Log with CAGE
- Teach Peace agreement builder
- Glossary and placeholders for Library, Community, Profile

## Run locally

```bash
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Stack
Vite + React + Tailwind + framer-motion.
Data is stored in localStorage. You can replace the store with API calls later.

## Deploy (Vercel)

One-click deploy (GitHub): Import this repository in Vercel (https://vercel.com/new) and select the project. Vercel will detect the static build and run `npm run build`. The `vercel.json` in the repo includes an SPA rewrite so routes fallback to `index.html`.

Using Vercel CLI:

```bash
# install CLI
npm i -g vercel

# link the project (first time)
vercel login
vercel link

# build and deploy
npm run build
vercel --prod
```

Notes:
- `npm run build` produces `dist/` which Vercel will serve. You can preview locally with `npm run preview`.
- If your app needs environment variables, set them in the Vercel dashboard or with `vercel env add`.
- The `vercel.json` file contains a rewrite to route all requests to `index.html` so client-side routing works (SPA fallback).

## Deployment (Vercel)

Import the repository into Vercel (https://vercel.com/new). Use the following settings when prompted:

- Framework Preset: Other / Static Site
- Build Command: npm run build
- Output Directory: dist

The included `vercel.json` config contains a SPA rewrite so all routes will fall back to `index.html`.

After import, Vercel will run the build and provide a live URL. If you need environment variables, set them in the Vercel project settings.
