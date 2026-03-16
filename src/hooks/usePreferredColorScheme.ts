import { useState, useEffect } from 'react';
import type { ColorScheme } from '../types';

const QUERY = '(prefers-color-scheme: dark)';

/**
 * Returns 'dark' or 'light' based on the user's system preference.
 * Updates when the user changes their OS/browser setting.
 */
export default function usePreferredColorScheme(): ColorScheme {
  const [scheme, setScheme] = useState<ColorScheme>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return 'light';
    return window.matchMedia(QUERY).matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handleChange = (e: MediaQueryListEvent) =>
      setScheme(e.matches ? 'dark' : 'light');
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return scheme;
}
