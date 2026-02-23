const STORAGE_KEY = 'planned-pooling-saves';

export function getSaves() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProject({ name, author, params, id }) {
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

  const newSave = {
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

export function deleteSave(id) {
  const saves = getSaves().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}

export function getExportFileName(projectTitle, extension) {
  const base = projectTitle?.trim()
    ? projectTitle.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim() || 'planned-pooling-pattern'
    : 'planned-pooling-pattern';
  return `${base}.${extension}`;
}
