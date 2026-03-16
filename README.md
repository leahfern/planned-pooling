# Planned Pooling Helper

Plan your crochet or knit color pooling pattern: set stitch counts per color, preview the grid, and export to image or PDF. Share a link to your pattern or save projects and yarns in the browser.

## Run locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production

```bash
npm run build
```

Output is in the `build` folder. Deploy that folder to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Test

```bash
npm test
```

## TypeScript

The project is set up for TypeScript. Core types live in `src/types.ts`. `theme`, `stitchPatterns`, and `usePreferredColorScheme` are already typed (`.ts`/`.tsx`). You can migrate the rest gradually by renaming files to `.ts`/`.tsx` and adding types; `allowJs: true` in `tsconfig.json` lets JS and TS coexist.

---

Built with [Create React App](https://github.com/facebook/create-react-app).
