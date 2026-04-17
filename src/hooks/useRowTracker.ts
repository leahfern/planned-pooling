import { useCallback, useEffect, useState } from 'react';

const ROW_KEY = 'stitchmap-current-row';

function readStoredRow(): number {
  try {
    const raw = window.localStorage.getItem(ROW_KEY);
    if (!raw) return 1;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 1 ? n : 1;
  } catch {
    return 1;
  }
}

/**
 * Persists current working row (1-based) for the row tracker.
 */
export function useRowTracker(totalRows: number): {
  currentRow: number;
  setRow: (n: number) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
} {
  const [currentRow, setCurrentRowState] = useState(1);

  useEffect(() => {
    setCurrentRowState(readStoredRow());
  }, []);

  const clamp = useCallback(
    (n: number) => Math.min(Math.max(1, n), Math.max(1, totalRows)),
    [totalRows]
  );

  const setRow = useCallback(
    (n: number) => {
      const v = clamp(n);
      setCurrentRowState(v);
      try {
        window.localStorage.setItem(ROW_KEY, String(v));
      } catch {
        /* ignore quota */
      }
    },
    [clamp]
  );

  useEffect(() => {
    setCurrentRowState((r) => clamp(r));
  }, [clamp, totalRows]);

  const next = useCallback(() => setRow(currentRow + 1), [currentRow, setRow]);
  const prev = useCallback(() => setRow(currentRow - 1), [currentRow, setRow]);
  const reset = useCallback(() => setRow(1), [setRow]);

  return { currentRow, setRow, next, prev, reset };
}
