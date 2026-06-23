# CivicLink

# TEAM : Developer Duo
## Team members 
Raag Shri (25BAI1O431)
Vaibhavi Yadav (25BAI10516)


> Spot a pothole, broken streetlight, overflowing bin, or hazard? Report it in 3 taps and track it to resolution.

CivicLink is a mobile-first civic issue reporting web app . It runs entirely in the browser with `localStorage` persistence and seeded dummy data — no backend setup required to demo. It is designed to help citizens report local civic issues (such as potholes, broken streetlights, garbage accumulation, hazards, etc.) and track their resolution status.

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

All colors are exposed as semantic tokens in `src/styles.css` — never hardcode hex values in components.

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
- This is a **frontend-only MVP** — no auth, no real database.
- Use on Mobile for Better Experience.


