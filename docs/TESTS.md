# Unit test suite

Tests are written with **Jest** and **React Testing Library** and live next to source files as `*.test.ts` or `*.test.tsx`.

## Setup

- **setupTests.ts**: jest-dom matchers, `TextEncoder`/`TextDecoder` polyfills for jsPDF, and a minimal `HTMLCanvasElement.prototype.getContext('2d')` mock for GraphCanvas.
- **react-router-dom**: Jest resolves it via `moduleNameMapper` in `package.json` to `__mocks__/react-router-dom.js` so router-dependent code runs without the real ESM package.

## What’s tested

| Area | File | Coverage |
|------|------|----------|
| **Utils** | `src/utils/colorUtils.test.ts` | `getRandomColor`: valid `#RRGGBB`, not a single constant across calls |
| **Constants** | `src/constants/projectMetadata.test.ts` | `INPUT_LIMITS` invariants; hook/stitch dropdowns have labels and `''` / `other` |
| **API** | `src/api/colorDetails.test.ts` | `getColorDetails`: empty/invalid hex, API success, API error, fetch mock |
| **Hooks** | `src/hooks/useSavedProjects.test.ts` | `getSaves`, `saveProject`, `deleteSave`, `getExportFileName` (localStorage) |
| **Hooks** | `src/hooks/useSavedYarns.test.ts` | `getSavedYarns`, `saveYarn`, `deleteYarn` (localStorage) |
| **Hooks** | `src/hooks/useUrlParams.test.tsx` | Default params, reading from URL search, `setParams` (with router mock) |
| **Components** | `src/Toast.test.tsx` | Empty vs message; `role="status"` / `aria-live`; error type |
| **Components** | `src/ShareButton.test.tsx` | Renders button, clipboard copy, onCopySuccess, onCopyError |
| **Components** | `src/Instructions.test.tsx` | Toggle expand/collapse, aria-expanded, content visibility |
| **Components** | `src/graph/Graph.test.tsx` | Row count = height; `.pixel` count per row = length |

We intentionally **do not** test raw constants (`grid.ts`, `stitchPatterns.ts`) or a full **App** mount in Jest — those add little signal vs. TypeScript + focused tests; use E2E or manual QA for full-app flows.

## Running tests

- **Watch mode (default):** `npm test`
- **Single run (e.g. CI):** `CI=true npm test -- --watchAll=false`
- **One file:** `npm test -- --testPathPattern=colorUtils`

## Notes

- **localStorage**: `useSavedProjects` and `useSavedYarns` tests clear or use a fixed key; no cross-test pollution.
- **fetch**: `colorDetails.test.ts` mocks `global.fetch` for the color API.
- **Clipboard**: `ShareButton.test.tsx` mocks `navigator.clipboard.writeText` with `configurable: true` so it can be redefined per test.
