# Stream Planning Manager

A personal planning tool for Twitch streamers. Schedule your streams, manage reminders, and generate formatted Discord schedule messages — all in one place, all stored locally on your machine.

Built by [Threev Prime](https://twitch.tv/threevprime).

---

## Features

- **Stream Planner** — Create and manage stream sessions with title, date/time, duration, game/project, notes, and status tracking (planned → live → completed).
- **Reminders** — One-off and recurring reminders with overdue indicators and relative time display.
- **Discord Schedule Generator** — Pick a week, select your streams, and get a ready-to-paste Discord message with proper [Discord timestamps](https://hammertime.cyou) that display in each reader's local timezone.
- **Settings** — Configure your streamer name, Twitch username, timezone, and default stream duration.

---

## Tech Stack

|                  |                                             |
| ---------------- | ------------------------------------------- |
| Frontend         | React 19 + TypeScript + Vite                |
| State management | Zustand                                     |
| Data storage     | Local JSON files via File System Access API |
| Dev runtime      | [Bun](https://bun.sh)                       |
| Linting          | ESLint + `@typescript-eslint`               |
| Formatting       | Prettier                                    |

No database, no server, no accounts. Everything runs in the browser and your data stays on your machine.

---

## Browser Compatibility

This app uses the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) to read and write your data files directly on your machine. This API is supported in:

- ✅ Chrome 86+
- ✅ Edge 86+
- ❌ Firefox (not supported)
- ❌ Safari (not supported)

---

## How Data Storage Works

On first launch a setup screen appears asking you to choose a save location. The app creates a `Stream-Planning-SaveData/` folder inside the location you pick, containing three JSON files:

```
Stream-Planning-SaveData/
  streams.json      # planned stream sessions
  reminders.json    # reminders
  settings.json     # app configuration
```

The folder path is remembered in your browser. On subsequent visits you'll get a single "Reconnect" prompt — a browser security requirement — and then the app loads normally. You can change or forget the save location at any time from the Settings page.

---

## Running Locally (dev)

Requires [Bun](https://bun.sh) v1.0 or later.

```bash
git clone https://github.com/threevprime/Live-Stream-Planner.git
cd Live-Stream-Planner
bun install
bun run dev
```

Then open **http://localhost:5173** in Chrome or Edge.

---

## Building

```bash
bun run build
```

This produces a `dist/` folder of static files (HTML, JS, CSS) that can be deployed anywhere. No server required.

To preview the build locally before deploying:

```bash
bun run preview
```

---

## Hosting

Because this is a pure frontend app you can host it on any static file host:

| Host                                             | Free tier | Notes                                                                     |
| ------------------------------------------------ | --------- | ------------------------------------------------------------------------- |
| [GitHub Pages](https://pages.github.com)         | ✅        | Build with the action below                                               |
| [Netlify](https://netlify.com)                   | ✅        | Connect repo, set build command to `bun run build`, publish dir to `dist` |
| [Vercel](https://vercel.com)                     | ✅        | Same as Netlify                                                           |
| [Cloudflare Pages](https://pages.cloudflare.com) | ✅        | Same as Netlify                                                           |

> **Note:** The File System Access API requires HTTPS (or localhost). All of the above hosts serve over HTTPS automatically, so this is not something you need to think about.

### GitHub Pages (automatic deploy)

Create `.github/workflows/deploy.yml` in the repo:

```yaml
name: Deploy

on:
    push:
        branches: [main]

jobs:
    deploy:
        runs-on: ubuntu-latest
        permissions:
            contents: read
            pages: write
            id-token: write
        environment:
            name: github-pages
            url: ${{ steps.deploy.outputs.page_url }}
        steps:
            - uses: actions/checkout@v4
            - uses: oven-sh/setup-bun@v2
            - run: bun install
            - run: bun run build
            - uses: actions/upload-pages-artifact@v3
              with:
                  path: dist
            - id: deploy
              uses: actions/deploy-pages@v4
```

Then go to your repo **Settings → Pages** and set the source to **GitHub Actions**.

---

## Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `bun run dev`          | Start dev server (port 5173)     |
| `bun run build`        | Build for production → `dist/`   |
| `bun run preview`      | Preview the production build     |
| `bun run lint`         | Run ESLint                       |
| `bun run lint:fix`     | Run ESLint with auto-fix         |
| `bun run format`       | Format all files with Prettier   |
| `bun run format:check` | Check formatting without writing |

---

## Project Structure

```
Live-Stream-Planner/
├── public/assets/          # Static assets (logo, etc.)
├── src/
│   ├── components/         # Shared components
│   ├── pages/              # Page components
│   ├── store/              # Zustand stores
│   ├── styles/             # Global CSS and theme
│   ├── utils/              # datetime helpers, File System API, IndexedDB
│   └── types.ts            # Shared TypeScript types
├── index.html
├── vite.config.ts
└── package.json
```

---

## Discord Timestamps

The Discord Schedule page generates messages using Discord's native timestamp format:

```
<t:UNIX_TIMESTAMP:FORMAT>
```

Discord renders these in each reader's own local timezone automatically.

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

## Contributing

Issues and pull requests are welcome.

- Run `bun run lint` and `bun run format:check` before opening a PR — the pre-commit hook enforces this automatically.
- Keep changes focused; one feature or fix per PR.

---

## License

MIT
