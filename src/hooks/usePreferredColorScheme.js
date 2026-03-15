import { useState, useEffect } from 'react';

const QUERY = '(prefers-color-scheme: dark)';

/**
 * Returns 'dark' or 'light' based on the user's system preference.
 * Updates when the user changes their OS/browser setting.
 */
export default function usePreferredColorScheme() {
  const [scheme, setScheme] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return 'light';
    return window.matchMedia(QUERY).matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handleChange = (e) => setScheme(e.matches ? 'dark' : 'light');
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return scheme;
}
