# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Rota is a frontend-only interactive learning platform. It has two logical sections:
1. **Orchestrator** — catalog, subject overview, and per-topic navigation; reads a `manifest.json` to discover subjects/topics and applies per-subject theming
2. **Content library** — pre-authored JSON files describing topics as ordered arrays of typed blocks (text, math, chart, plot, visualization, quiz)

The Python backend (`backend/`) is dormant and not used by the platform.

## Running the app

```bash
cd frontend
npm run dev      # dev server (Vite, default port 5173)
npm run build    # production build
npm run preview  # serve the production build locally
```

## Architecture

### Content data flow

```
public/content/manifest.json
  └─ subjects[] → topics[] → file: "linear-algebra/vectors.json"

public/content/subjects/<subject>/<topic>.json
  └─ blocks[] → { type, ...props }
```

The `useManifest` hook fetches and caches `manifest.json`. `TopicPage` fetches individual topic JSON files on demand. All content lives under `public/content/` and is served as static assets.

### Key source files

| Path | Role |
|------|------|
| `src/App.jsx` | Router root; wraps everything in `ThemeProvider` + `ProgressProvider` |
| `src/context/ThemeContext.jsx` | Writes per-subject CSS custom properties to `:root` on navigation |
| `src/context/ProgressContext.jsx` | Exposes `useProgress` via context |
| `src/hooks/useManifest.js` | Fetches + caches manifest; provides `getSubject(id)` |
| `src/hooks/useProgress.js` | `localStorage`-backed topic completion state |
| `src/pages/Catalog.jsx` | Subject grid (orchestrator home); resets theme on mount |
| `src/pages/SubjectOverview.jsx` | Topic list + progress bar for one subject |
| `src/pages/TopicPage.jsx` | Fetches and renders a topic JSON file |
| `src/components/NavSidebar.jsx` | Sticky sidebar: TOC + prev/next nav within a subject |
| `src/renderer/BlockRenderer.jsx` | Routes `block.type` → the right block component |
| `src/visualizations/registry.js` | Maps component name strings to React components for `VisualizationBlock` |

### Block types (renderer/blocks/)

| `type` | Component | Notes |
|--------|-----------|-------|
| `text` | `TextBlock` | Sanitized HTML via DOMPurify |
| `math` | `MathBlock` | KaTeX; `display: true` for block math |
| `chart` | `ChartBlock` | Recharts; `variant`: bar/line/area/pie; `data` + `keys` |
| `plot` | `PlotBlock` | Plotly.js loaded lazily; `plotData` + `layout` (Plotly format) |
| `visualization` | `VisualizationBlock` | Named component looked up from `registry.js`; `props` forwarded |
| `embed` | `EmbedBlock` | Sandboxed iframe; `src` points to a static HTML file |
| `quiz` | `QuizBlock` | Multiple-choice; `options[]`, `answer` (index), `explanation` |

### Adding a new visualization

1. Create `src/visualizations/MyViz.jsx`
2. Add it to `src/visualizations/registry.js`
3. Reference it in topic JSON: `{ "type": "visualization", "component": "MyViz", "props": {} }`

### Theming

Each subject in `manifest.json` has a `theme` object: `{ primary, accent, bg }`. When a user navigates to a subject, `ThemeContext` sets `--color-primary`, `--color-primary-light`, and `--color-bg-tinted` on `document.documentElement`. All UI elements inherit these via CSS custom properties (defined in `src/styles/global.css`).

### Progress

`useProgress` stores `{ "subjectId/topicId": { completed, quizScore, completedAt } }` in `localStorage` under key `rota:progress`. The "Mark Complete" button on each topic page calls `markComplete(subjectId, topicId)`.

## Content authoring

### manifest.json schema
```json
{
  "subjects": [{
    "id": "string",
    "title": "string",
    "description": "string",
    "icon": "emoji or string",
    "theme": { "primary": "#hex", "accent": "#hex", "bg": "#hex" },
    "topics": [{ "id": "string", "title": "string", "file": "relative/path.json", "estimatedMinutes": 20 }]
  }]
}
```

### Topic JSON schema
```json
{
  "id": "string",
  "title": "string",
  "estimatedMinutes": 20,
  "blocks": [
    { "type": "text", "content": "<p>HTML</p>" },
    { "type": "math", "display": true, "content": "LaTeX string" },
    { "type": "chart", "variant": "bar", "title": "...", "data": [...], "keys": ["y1","y2"] },
    { "type": "visualization", "component": "VectorSpace2D", "props": {} },
    { "type": "quiz", "question": "?", "options": ["A","B","C"], "answer": 0, "explanation": "..." }
  ]
}
```
