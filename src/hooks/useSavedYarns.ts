import type { ColorSequenceItem, SavedYarn } from '../types';

const STORAGE_KEY = 'skeinsmith-yarns';
const LEGACY_STORAGE_KEY = 'planned-pooling-yarns';

// One-time migration: copy any yarns from the pre-rebrand key to the
// current key if the current key hasn't been written yet.
function migrateLegacyKey(): void {
  try {
    if (localStorage.getItem(STORAGE_KEY) !== null) return;
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) localStorage.setItem(STORAGE_KEY, legacy);
  } catch {
    /* ignore */
  }
}

export function getSavedYarns(): SavedYarn[] {
  migrateLegacyKey();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedYarn[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface SaveYarnInput {
  brand?: string;
  name?: string;
  colorway?: string;
  colorSequence?: ColorSequenceItem[];
}

export function saveYarn({
  brand,
  name,
  colorway,
  colorSequence,
}: SaveYarnInput): SavedYarn {
  const yarns = getSavedYarns();
  const newYarn: SavedYarn = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    brand: (brand ?? '').trim(),
    name: (name ?? '').trim(),
    colorway: (colorway ?? '').trim(),
    colorSequence: Array.isArray(colorSequence) ? colorSequence : [],
    savedAt: new Date().toISOString(),
  };
  yarns.unshift(newYarn);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(yarns));
  return newYarn;
}

export function deleteYarn(id: string): void {
  const yarns = getSavedYarns().filter((y) => y.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(yarns));
}
