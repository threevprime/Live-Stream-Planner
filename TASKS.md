# Tasks

_Updated by Claude as work progresses. Check off items when done; add new items as scope grows._

---

## Phase 1 — Project Setup

- [x] Initialize Bun project (`bun init`)
- [x] Set up Vite + React with TypeScript
- [x] Install dependencies: `react`, `react-dom`, `zustand`, `react-router-dom`
- [x] Set up Bun backend entry point (`server/index.ts`)
- [x] Configure concurrent dev script (Bun server + Vite frontend)
- [x] Create `data/` directory with empty JSON stubs (`streams.json`, `reminders.json`, `settings.json`)
- [x] Copy brand assets to `public/assets/` (logo, pfp)
- [x] Set up CSS custom properties for brand palette in `src/styles/theme.css`
- [x] Set up base layout component with sidebar navigation

---

## Phase 2 — Backend / Storage Layer

- [x] Write `server/storage.ts` — generic JSON read/write helpers
- [x] Implement `GET /api/streams` — list all streams
- [x] Implement `POST /api/streams` — create stream
- [x] Implement `PUT /api/streams/:id` — update stream
- [x] Implement `DELETE /api/streams/:id` — delete stream
- [x] Implement `GET /api/reminders` — list all reminders
- [x] Implement `POST /api/reminders` — create reminder
- [x] Implement `PUT /api/reminders/:id` — update reminder
- [x] Implement `DELETE /api/reminders/:id` — delete reminder
- [x] Implement `GET /api/settings` and `PUT /api/settings`

---

## Phase 3 — Zustand Stores

- [x] `streamsStore.ts` — state + actions for stream sessions (CRUD, local cache)
- [x] `remindersStore.ts` — state + actions for reminders
- [x] `settingsStore.ts` — app settings (streamer name, timezone, default stream duration, etc.)
- [x] Wire stores to backend API calls (fetch on mount, sync on mutation)

---

## Phase 4 — Stream Planner Page

- [x] Stream list view (all upcoming + past streams)
- [x] Stream card component (title, date/time, duration, game, status badge)
- [x] Create/edit stream modal or form
    - [x] Title field
    - [x] Date + time picker
    - [x] Estimated duration picker
    - [x] Game/project category field
    - [x] Notes/description textarea
    - [x] Status selector (planned / live / completed / cancelled)
- [x] Delete stream with confirmation
- [x] Filter streams by status
- [ ] Calendar view (week/month)

---

## Phase 5 — Reminders Page

- [x] Reminders list view (sorted by due date)
- [x] Reminder card component (title, due date/time, relative time, description)
- [x] Create/edit reminder form
    - [x] Title field
    - [x] Date + time picker
    - [x] Description textarea
    - [x] Recurring toggle + interval selector (daily / weekly / custom)
- [x] Delete reminder
- [x] In-app badge/indicator when a reminder is due or overdue
- [x] Mark reminder as done

---

## Phase 6 — Discord Schedule Generator Page

- [x] Week picker — select which week to generate schedule for
- [x] Pull streams for that week from the planner
- [x] Allow manually adding/excluding streams from the schedule message
- [x] Discord timestamp helper — convert JS Date to `<t:TS:FORMAT>` strings
- [x] Message template with brand-appropriate formatting (emojis, headers, etc.)
- [x] Live preview of the generated Discord message
- [x] Copy to clipboard button
- [x] Custom intro/outro text editable in the UI

---

## Phase 7 — Settings Page

- [x] Streamer name / display name
- [x] Timezone selector (used for Discord timestamp generation)
- [x] Default stream duration
- [ ] Discord message template customization
- [ ] Theme preview

---

## Phase 8 — Polish & Extras

- [ ] Responsive layout (usable on different screen sizes)
- [ ] Keyboard shortcuts for common actions
- [ ] Discord graphics generator — weekly schedule image export (PNG)
- [ ] Dark/light mode toggle (default: dark, matching brand)
- [ ] README for open-source release
- [ ] `.gitignore` — exclude `data/` by default so streamers don't accidentally commit personal data
- [ ] Export / import data (JSON backup)

---

## Bugs / Known Issues

_None yet — log issues here as they come up._
