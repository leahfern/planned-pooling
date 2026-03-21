# Planned Pooling Helper

Plan your crochet or knit color pooling pattern: set stitch counts per color, preview the grid, and export to image or PDF. Share a link to your pattern or save projects and yarns in the browser.

This is an **actively maintained product**, not a throwaway demo. The source may stay available for transparency and learning; **how it’s hosted, licensed, or offered commercially can evolve**—details like pricing or paid tiers aren’t documented here yet.

## Prerequisites

- **[Node.js](https://nodejs.org/)** — **18.x or newer** (LTS recommended). Matches what Create React App 5 and the toolchain expect.
- **npm** (comes with Node).

## Quick start

```bash
git clone https://github.com/<your-fork-or-upstream>/planned-pooling.git
cd planned-pooling
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). The dev server reloads when you edit files.

## Scripts

| Command | Purpose |
|--------|---------|
| `npm start` | Dev server (hot reload) |
| `npm run build` | Production build → `build/` |
| `npm test` | Jest + React Testing Library (interactive watch mode) |
| `CI=true npm test -- --watchAll=false` | Run the full test suite once (good before a PR) |

## Project layout

```
src/
  api/           # External API helpers (e.g. color lookup)
  colorEditor/   # Color list, picker, side panel
  constants/     # Grid limits, form metadata
  graph/         # Grid canvas, rows, pixels
  graphEditor/   # Dimensions, stitch pattern, zoom
  hooks/         # URL params, saved projects/yarns, theme preference
  modules/       # Stitch pattern IDs
  utils/         # Export, color helpers
  types.ts       # Shared TypeScript types
  theme.ts       # Light/dark themes (styled-components)
```

Tests live next to code as `*.test.ts` / `*.test.tsx`. See **[docs/TESTS.md](docs/TESTS.md)** for what’s covered and Jest setup notes.

## Contributing

Bug reports, docs improvements, tests, and focused code changes are welcome. Because the app has a **product direction**, larger features or UX shifts are easiest to merge when they align with that roadmap—**open an issue first** if you’re not sure.

1. **Fork** the repo and create a **branch** for your change (`fix/…`, `feat/…`, `docs/…`).
2. **Run tests** before opening a PR:
   ```bash
   CI=true npm test -- --watchAll=false
   ```
3. **Build** should succeed:
   ```bash
   npm run build
   ```
4. **Describe your change** in the PR: what problem it solves and how you tested it.

### Code & types

- The app is **TypeScript** (`src/**/*.ts`, `src/**/*.tsx`). Shared types are in **`src/types.ts`**.
- Styling uses **styled-components** with themes in **`src/theme.ts`**.
- Prefer **small, focused changes** and tests for new behavior when it’s practical.

### Docs for maintainers

- **[docs/TYPESCRIPT-ANY-UNKNOWN-ASSERTIONS.md](docs/TYPESCRIPT-ANY-UNKNOWN-ASSERTIONS.md)** — where we use strict typing escape hatches and why.

## Build for production

```bash
npm run build
```

Output is in the `build` folder. Deploy that folder to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

Built with [Create React App](https://github.com/facebook/create-react-app).
