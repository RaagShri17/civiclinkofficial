# CivicLink
# TEAM : Developer Duo

> Spot a pothole, broken streetlight, overflowing bin, or hazard? Report it in 3 taps and track it to resolution.

CivicLink is a mobile-first civic issue reporting web app built for a hackathon MVP. It runs entirely in the browser with `localStorage` persistence and seeded dummy data — no backend setup required to demo. It is designed to help citizens report local civic issues (such as potholes, broken streetlights, garbage accumulation, hazards, etc.) and track their resolution status.

## Features

- **Home Dashboard** — personal impact stats (Reported / Resolved / Community Score), quick actions, recent activity
- **Report Issue** — 3-step form (Category + severity → Location → Photo + description), +10 XP per submission
- **Community Feed** — recent reports with filters (All / Nearby / Resolved) and upvotes
- **Map View** — interactive Leaflet map with status-colored pins and popups
- **My Reports** — your submissions with Pending → In Progress → Resolved status tracker
- **Hotlines** — quick-dial directory of emergency and civic numbers
- **Gamification** — XP rewards and "Active Citizen" badge

## Tech stack

- **TanStack Start v1** (file-based routing, SSR-ready) on **React 19**
- **Vite 7** build tool
- **Tailwind CSS v4** with semantic OKLCH design tokens
- **shadcn/ui** + **Lucide** icons
- **Leaflet** + **react-leaflet** with OpenStreetMap tiles (no API key)
- **sonner** for toasts
- State via `useSyncExternalStore` backed by `localStorage` (`src/lib/civic-store.ts`)

## Color palette

| Token | Hex | Use |
| --- | --- | --- |
| Background | `#454040` | App surface |
| Muted | `#605B51` | Borders, secondary surfaces |
| Primary | `#D8D365` | CTAs, active nav, accents |
| Primary glow | `#E6F082` | XP highlights |

All colors are exposed as semantic tokens in `src/styles.css` - never hardcode hex values in components.

## Getting started (VS Code)

Prerequisites: **[Bun](https://bun.sh)** (recommended) or Node 20+.

```bash
# 1. Clone (via the GitHub button in Lovable → Connect → clone)
git clone <your-repo-url>
cd civiclink

# 2. Install dependencies
bun install

# 3. Start the dev server
bun run dev
```

### Scripts

| Command | What it does |
| --- | --- |
| `bun run dev` | Start Vite dev server with HMR |
| `bun run build` | Production build |
| `bun run start` | Preview the production build |

## Project structure

```text
src/
├── routes/                 # File-based routing (TanStack Start)
│   ├── __root.tsx          # App shell + sticky bottom nav + toaster
│   ├── index.tsx           # Home Dashboard
│   ├── report.tsx          # 3-step report form
│   ├── feed.tsx            # Community Feed
│   ├── map.tsx             # Leaflet map view
│   ├── my-reports.tsx      # User's own reports
│   └── hotlines.tsx        # Emergency contacts
├── lib/
│   └── civic-store.ts      # localStorage-backed reactive store
├── components/ui/          # shadcn/ui primitives
└── styles.css              # Tailwind v4 theme + design tokens
```

## Notes

- This is a **frontend-only MVP** — no auth, no real database. Perfect for a hackathon demo.
- To clear seeded data, run `localStorage.clear()` in the browser console and refresh.
- To upgrade to a real backend (Postgres, auth, file storage), enable **Lovable Cloud** from the chat — the `civic-store.ts` layer can be swapped for live queries without touching the routes.

## Team members 
Raagshri (25BAI1O431)
Vaibhavi Yadav (25BAI10516)
