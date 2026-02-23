const STORAGE_KEY = 'planned-pooling-yarns';

export function getSavedYarns() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveYarn({ brand, name, colorway, colorSequence }) {
  const yarns = getSavedYarns();
  const newYarn = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    brand: (brand || '').trim(),
    name: (name || '').trim(),
    colorway: (colorway || '').trim(),
    colorSequence: Array.isArray(colorSequence) ? colorSequence : [],
    savedAt: new Date().toISOString(),
  };
  yarns.unshift(newYarn);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(yarns));
  return newYarn;
}

export function deleteYarn(id) {
  const yarns = getSavedYarns().filter((y) => y.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(yarns));
}
