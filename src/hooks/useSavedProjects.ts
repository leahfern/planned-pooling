import type { AppParams, SavedProject } from '../types';

const STORAGE_KEY = 'skeinsmith-saves';
const LEGACY_STORAGE_KEY = 'planned-pooling-saves';

// One-time migration: copy any saves from the pre-rebrand key to the
// current key if the current key hasn't been written yet. Leaves the legacy
// key in place so downgrading wouldn't lose data.
function migrateLegacyKey(): void {
  try {
    if (localStorage.getItem(STORAGE_KEY) !== null) return;
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) localStorage.setItem(STORAGE_KEY, legacy);
  } catch {
    /* ignore */
  }
}

export function getSaves(): SavedProject[] {
  migrateLegacyKey();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedProject[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface SaveProjectInput {
  name?: string;
  author?: string;
  params: AppParams;
  id?: string;
}

export function saveProject({
  name,
  author,
  params,
  id,
}: SaveProjectInput): SavedProject {
  const saves = getSaves();
  const nameTrim = name?.trim() || 'Untitled';
  const authorTrim = author?.trim() || '';

  if (id) {
    const index = saves.findIndex((s) => s.id === id);
    if (index !== -1) {
      saves[index] = {
        ...saves[index],
        name: nameTrim,
        author: authorTrim,
        savedAt: new Date().toISOString(),
        params,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
      return saves[index];
    }
  }

  const newSave: SavedProject = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    name: nameTrim,
    author: authorTrim,
    savedAt: new Date().toISOString(),
    params,
  };
  saves.unshift(newSave);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
  return newSave;
}

export function deleteSave(id: string): void {
  const saves = getSaves().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}

export function getExportFileName(
  projectTitle: string | undefined,
  extension: string
): string {
  const base = projectTitle?.trim()
    ? projectTitle.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim() ||
      'skeinsmith-pattern'
    : 'skeinsmith-pattern';
  return `${base}.${extension}`;
}
