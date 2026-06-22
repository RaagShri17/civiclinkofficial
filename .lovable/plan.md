# CivicLink — Build Plan

A mobile-first civic issue reporting web app, adapted from your wireframe. MVP scope only (5 core sections), with everything else stubbed as static.

## Design system

Palette from your upload (applied as semantic tokens in `src/styles.css`):
- `#454040` — background / dark surface
- `#605B51` — muted surface / borders
- `#D8D365` — primary (CTAs, active nav, accents)
- `#E6F082` — primary-glow / highlights / XP

Typography: clean sans (Inter) + a slightly editorial display for headings. Rounded 2xl cards, soft shadows tinted with primary, sticky bottom nav on mobile, max-width container on desktop that mimics the phone-frame feel.

## Pages (TanStack Start routes)

```text
src/routes/
  __root.tsx          shell + bottom nav + toaster
  index.tsx           Home Dashboard
  report.tsx          Report Issue (multi-step)
  feed.tsx            Community Feed
  map.tsx             Map View
  my-reports.tsx      My Reports
  hotlines.tsx        Hotlines (static)
  auth.tsx            Login / Register / Guest
```

### 1. Home Dashboard (`/`)
- Header: "CIVICLINK" + bell icon (toast on click)
- Welcome card: avatar, "Welcome Back!", "Active Citizen" badge, 3 stat tiles (Reported / Resolved / Community Score) pulled from backend
- Prominent "Report Issue" card with camera icon → `/report`
- 2×2 quick-action grid: Map / Feed / My Reports / Hotlines
- Recent Feed Activity (latest 3 reports)
- Sticky bottom nav (Home · Feed · Report · Map · My Reports)

### 2. Report Issue (`/report`)
3 steps with progress indicator:
1. Category chips (Pothole, Streetlight, Garbage, Hazard, Other) + severity slider
2. Location: auto-detect (geolocation API) + manual address input + map preview pin
3. Description textarea + photo upload (to Cloud storage)

Submit → inserts row → confirmation screen with "+10 XP" animation → redirect to My Reports.

### 3. Community Feed (`/feed`)
- Filter tabs: All / Nearby / Resolved
- Cards: photo, category badge, title, location, "2h ago", status pill, upvote button
- Pulls from `reports` table ordered by recency

### 4. Map View (`/map`)
- Leaflet + OpenStreetMap tiles (no API key needed)
- Pin per report, colored by status; popup with title/category/status + "View"
- Category + status filter chips
- "Report at this location" floating button

### 5. My Reports (`/my-reports`)
- List of current user's reports with status tracker (Pending → In Progress → Resolved)
- Tap row → detail sheet with photo + description + comments stub

### Secondary
- **Hotlines** — static list with `tel:` links
- **Auth** — email/password via Lovable Cloud + "Continue as Guest" (local session)

## Backend (Lovable Cloud)

Enabled at start of build. Tables (with RLS + grants):

- `profiles` — id (auth.users), display_name, xp, badges[]
- `reports` — id, user_id, category, title, description, severity, lat, lng, address, photo_url, status (pending/in_progress/resolved), created_at
- `upvotes` — report_id, user_id (unique pair)
- `comments` — id, report_id, user_id, body, created_at

Storage bucket: `report-photos` (public read).

RLS: anyone authenticated can read reports/comments; users can insert/update their own; only service role can mark resolved (admin demo flow uses a server function gated by a role check via `has_role` + `user_roles` table).

Seeded with ~8 dummy reports across nearby coordinates so Feed/Map look alive on first load.

## Gamification
- +10 XP per submitted report (DB trigger updates `profiles.xp`)
- Badge awards: First Report, 5 Reported, First Resolved (computed on read)

## Out of scope for MVP (stub or omit)
- Full leaderboard page (XP shown on dashboard only)
- Admin dashboard
- Dark/light toggle (ship dark-by-default using the palette)
- Real notifications (use toast simulation)

## Note on "separate frontend/backend + VS Code setup"

Lovable projects are a single TanStack Start app — frontend routes + server functions live together, and the backend (Postgres, auth, storage) is provisioned automatically via Lovable Cloud. There isn't a separate backend folder to run. You can still open the repo in VS Code (clone via the GitHub button, `bun install`, `bun run dev`), but I won't split it into two projects. If you specifically want a standalone Express/Node backend instead, say so and I'll restructure — it will mean more setup and no managed auth/storage.

## Build order
1. Enable Lovable Cloud, create schema + seed
2. Design tokens in `src/styles.css` + shell/bottom nav in `__root.tsx`
3. Home Dashboard
4. Report flow + storage upload
5. Feed + My Reports
6. Map (Leaflet)
7. Hotlines + Auth + polish
