# JVDT Learning Hub
<<<<<<< HEAD
[![CI](https://github.com/jvdutoit/jvdt-learning-app/actions/workflows/ci.yml/badge.svg)](https://github.com/jvdutoit/jvdt-learning-app/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js Version](https://img.shields.io/badge/node-20-green)

Vite + React + Tailwind + Framer Motion. A learning prototype implementing the Four Keys of Understanding, the Train Journey, a searchable Glossary, a Reflection (CAGE) journal, and a Teach Peace daily pact.

# JVDT Learning Hub
[![CI](https://github.com/jvdutoit/jvdt-learning-app/actions/workflows/ci.yml/badge.svg)](https://github.com/jvdutoit/jvdt-learning-app/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js Version](https://img.shields.io/badge/node-20-green)

A comprehensive educational platform implementing the JVDT (Johannes van der Tuin) methodology with AI-powered resource generation, diagnostic assessments, interactive learning modules, and gamified experiences.

## Demo
![JVDT Learning Hub Screenshot](./docs/screenshot.png)

## Features

### 🎯 **Core Learning Modules**
- **Four Keys** — Association, Analysis, Root, Context (JSON-driven methodology)
- **Train Journey** — Information → Integration → Comprehension → Application (progress tracking + localStorage)
- **Glossary** — 60+ pedagogical terms with search, filters, and detail views

### 📊 **Diagnostic Testing**
- **English Fluency Assessment** — 20 comprehensive questions
- **JVDT-7 Evaluation** — 28 questions across 7 key areas
- **Progress Tracking** — localStorage persistence with detailed analytics
- **Results Analysis** — Category breakdowns and adaptive recommendations

### 🤖 **AI Resource Builder**
- **Custom Content Generation** — AI-powered educational material creation
- **Multiple Formats** — Flashcards, workbooks, assessments, scenarios, toolkits, guides
- **JVDT Integration** — Aligned with Association, Analysis, Root, Context, Integration keys
- **Smart Filtering** — Search by category, difficulty, format, and learning objectives

### 🎮 **Interactive Features**
- **Game Arcade** — 10 educational games with AI integration and sound effects
- **Reflection (CAGE)** — Personal journaling with autosave and export capabilities
- **Teach Peace** — Daily practice tracking for Love, Respect, Happiness

## Setup

### Basic Installation
```bash
npm install
npm run dev
```

### AI Resource Generation Setup
To enable AI-powered resource creation:

1. Get a Google Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey)
2. Copy `.env.example` to `.env`
3. Add your API key:
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

### Production Build
```bash
npm run build
npm run preview
```

### Deployment
```bash
npm run deploy  # Deploys to GitHub Pages
```

## Tech Stack
- **Frontend**: Vite + React 18 + Tailwind CSS + Framer Motion
- **Routing**: React Router DOM v6
- **AI Integration**: Google Gemini API
- **Audio**: Tone.js (for arcade games)
- **Storage**: localStorage for persistence
- **Testing**: Vitest + Testing Library
- **Deployment**: GitHub Pages with automated CI/CD

## Project Structure
```
src/
├── components/
│   ├── diagnostics/     # Assessment system
│   ├── resources/       # AI resource builder
│   └── ...             # Core learning modules
├── data/               # Static content and test definitions
├── services/           # AI and external service integrations
└── main.jsx           # Application entry point
```

## Development

### Running Tests
```bash
npm test
```

### Adding New Resource Types
1. Update `aiResourceService.js` with new format instructions
2. Add rendering logic to `ResourceViewer.jsx`
3. Update form options in `ResourceGenerator.jsx`

### API Key Security
- API key is client-side visible (Vite requirement)
- Set up domain restrictions in Google Cloud Console
- Monitor usage and set appropriate quotas
- Consider backend proxy for production applications

## Contributing
This is an educational prototype. Feel free to fork and adapt for your learning methodology needs.

## License
MIT License - see LICENSE file for details.

## Demo
![JVDT Learning Hub Screenshot](./docs/screenshot.png)

The screenshot above shows the Four Keys and Train Journey modules from the JVDT Learning Hub interface.

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
```bash
npm i
npm run dev
# production
npm run build && npm run preview
```
