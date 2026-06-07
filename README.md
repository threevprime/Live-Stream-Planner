# Stream Planning Manager

A personal planning tool for Twitch streamers. Schedule your streams, manage reminders, and generate formatted Discord schedule messages — all in one place, all stored locally.

Built by [Threev Prime](https://twitch.tv/threevprime).

---

## Features

- **Stream Planner** — Create and manage stream sessions with title, date/time, duration, game/project, notes, and status tracking (planned → live → completed).
- **Reminders** — One-off and recurring reminders with overdue indicators and relative time display.
- **Discord Schedule Generator** — Pick a week, select your streams, and get a ready-to-paste Discord message with proper [Discord timestamps](https://hammertime.cyou) that display in each reader's local timezone.
- **Settings** — Configure your streamer name, Twitch username, timezone, and default stream duration.

---

## Tech Stack

|                  |                               |
| ---------------- | ----------------------------- |
| Runtime          | [Bun](https://bun.sh)         |
| Frontend         | React 19 + TypeScript + Vite  |
| State management | Zustand                       |
| Data storage     | Local JSON files              |
| Linting          | ESLint + `@typescript-eslint` |
| Formatting       | Prettier                      |

No database, no cloud, no accounts. Data lives in `data/` on your machine.

---

## Prerequisites

- [Bun](https://bun.sh) v1.0 or later

---

## Setup

```bash
# Clone the repo
git clone https://github.com/threevprime/stream-planning-manager.git
cd stream-planning-manager

# Install dependencies and register git hooks
bun install

# Copy the example data files (first run only)
cp data/streams.json.example data/streams.json
cp data/reminders.json.example data/reminders.json
cp data/settings.json.example data/settings.json
```

> **Note:** The `data/` directory is gitignored by default so your personal schedule and reminders are never accidentally committed.

---

## Running

You need two processes running simultaneously — the Bun API server and the Vite dev server. Open two terminals:

```bash
# Terminal 1 — API server (port 3001)
bun run dev:server

# Terminal 2 — Frontend (port 5173)
bun run dev:client
```

Then open **http://localhost:5173** in your browser.

Alternatively, start both at once (background process):

```bash
bun run dev
```

---

## Scripts

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `bun run dev`          | Start both servers concurrently   |
| `bun run dev:server`   | Start only the Bun API server     |
| `bun run dev:client`   | Start only the Vite frontend      |
| `bun run build`        | Build the frontend for production |
| `bun run preview`      | Preview the production build      |
| `bun run lint`         | Run ESLint                        |
| `bun run lint:fix`     | Run ESLint with auto-fix          |
| `bun run format`       | Format all files with Prettier    |
| `bun run format:check` | Check formatting without writing  |

---

## Data Storage

All data is stored as JSON in the `data/` directory:

```
data/
  streams.json      # planned stream sessions
  reminders.json    # reminders
  settings.json     # app configuration
```

The API server reads and writes these files directly. There is no migration system — the schema is straightforward and changes will be noted in release notes if a manual update is ever needed.

---

## Discord Timestamps

The Discord Schedule page generates messages using Discord's native timestamp format:

```
<t:UNIX_TIMESTAMP:FORMAT>
```

Discord renders these in the reader's own local timezone and locale automatically. The generator uses `F` (full date + time) and `R` (relative, e.g. "in 3 hours") by default.

| Format code | Example output               |
| ----------- | ---------------------------- |
| `t`         | 9:00 PM                      |
| `T`         | 9:00:00 PM                   |
| `d`         | 06/07/2026                   |
| `D`         | June 7, 2026                 |
| `f`         | June 7, 2026 9:00 PM         |
| `F`         | Sunday, June 7, 2026 9:00 PM |
| `R`         | in 2 hours                   |

Reference: [hammertime.cyou](https://hammertime.cyou)

---

## Configuration

On first run, open the **Settings** page and set:

- Your display name and Twitch username
- Your local timezone (used for Discord timestamp generation)
- Default stream duration

These are saved to `data/settings.json`.

---

## Project Structure

```
stream-planning-manager/
├── data/                   # JSON data files (gitignored)
├── public/assets/          # Static assets (logo, etc.)
├── server/                 # Bun backend
│   ├── index.ts            # Server entry point
│   ├── storage.ts          # JSON read/write helpers
│   └── routes/             # Route handlers
│       ├── streams.ts
│       ├── reminders.ts
│       └── settings.ts
├── src/                    # React frontend
│   ├── components/         # Shared components
│   ├── pages/              # Page components
│   ├── store/              # Zustand stores
│   ├── styles/             # Global CSS and theme
│   └── types.ts            # Shared TypeScript types
├── index.html
├── vite.config.ts
└── package.json
```

---

## Contributing

Issues and pull requests are welcome. A few things to keep in mind:

- Run `bun run lint` and `bun run format:check` before opening a PR — the pre-commit hook enforces this automatically.
- Keep changes focused; one feature or fix per PR.
- The `data/` directory is personal — do not commit example data with real stream info.

---

## License

MIT
