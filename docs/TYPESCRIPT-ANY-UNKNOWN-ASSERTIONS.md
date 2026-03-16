# TypeScript: `any`, `unknown`, and type assertions

## `allowJs`

**Current setting:** `allowJs: true` is still set in `tsconfig.json`. You can set it to `false` now that all source files are `.ts`/`.tsx` if you want to forbid any remaining `.js` in `src/`.

---

## Uses of `any`

There are **no** explicit `any` types in application source under `src/`. The codebase does not use `any` in our own code.

---

## Remaining uses of `unknown` (and why they stay)

We removed `unknown` everywhere it was possible to type more precisely. Only **two** places still use `unknown`, and both are **required** by TypeScript — removing them causes a compile error.

### 1. `src/hooks/useUrlParams.ts` (lines 35 and 61)

```ts
(initialParams as unknown as Record<string, AppParams[keyof AppParams]>)[key] =
  getParam(key);
```

- **Why it stays:** We assign to `initialParams[key]` in a loop over `keyof AppParams`. TypeScript does not allow a direct cast from `AppParams` to `Record<string, AppParams[keyof AppParams]>` because `AppParams` has no index signature (“Conversion of type 'AppParams' to type 'Record<...>' may be a mistake”). The **double assertion** (`as unknown as Record<...>`) is the standard way to tell the compiler we know the assignment is safe. Using only `as Record<...>` without `unknown` fails with TS2352.
- **Runtime:** Correct; we only ever assign values from `getParam(key)` into the corresponding key.

### 2. `src/utils/exportGraphAsPdf.ts` (8 occurrences: lines 122, 128, 139, 142, 190, 193, 211, 214)

```ts
doc.setFont(undefined as unknown as string, 'bold');
doc.setFont(undefined as unknown as string, 'normal');
```

- **Why it stays:** We only want to change font style (bold/normal), not the font name. jsPDF’s `setFont(fontName?, fontStyle?)` is typed to require a `string` for the first argument. Passing `undefined` for “keep current font” is valid at runtime but not in the library’s types. TypeScript rejects `undefined as string` (“Conversion of type 'undefined' to type 'string' may be a mistake”). The **double assertion** (`undefined as unknown as string`) is required; a single `undefined as string` fails with TS2352.
- **Runtime:** Correct; jsPDF accepts `undefined` for the first argument when only changing style.

---

=

## Other type assertions (no `unknown`)

- **App.test.tsx:** `screen.getByLabelText(...) as HTMLInputElement` — so we can use `.value` / `.checked`.
- **useUrlParams.ts:** `Object.keys(defaultParams) as (keyof AppParams)[]` — `Object.keys` returns `string[]`; we know these are `AppParams` keys.

---

## Summary

| Item                        | Status                                                                                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `any` in app code           | Not used.                                                                                                                                                |
| `unknown` in app code       | Only in **two** required double assertions: `useUrlParams.ts` (2) and `exportGraphAsPdf.ts` (8). Both are necessary for the compiler to accept the code. |
| Declaration files (`.d.ts`) | No `unknown`; we use concrete types or removed index signatures.                                                                                         |

If jsPDF or TypeScript gains better support for “optional first argument” or mapped key assignment in the future, we could revisit these two spots; until then, the double assertion is the correct and minimal approach.
