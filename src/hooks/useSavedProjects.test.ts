import {
  getSaves,
  saveProject,
  deleteSave,
  getExportFileName,
} from './useSavedProjects';
import type { AppParams } from '../types';

const STORAGE_KEY = 'skeinsmith-saves';
const LEGACY_STORAGE_KEY = 'planned-pooling-saves';

function getMinimalParams(): AppParams {
  return {
    graphLength: 10,
    graphHeight: 10,
    showGridlines: true,
    stitchPattern: 'back-and-forth',
    colorSequence: [],
    showSidePanel: true,
    zoom: 1,
    hookNeedleSize: '',
    hookNeedleSizeOther: '',
    stitchType: '',
    stitchTypeOther: '',
    lotNumber: '',
    notes: '',
    yarnBrand: '',
    yarnName: '',
    yarnColorway: '',
  };
}

describe('useSavedProjects', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  });

  describe('getSaves', () => {
    it('returns empty array when no saves', () => {
      expect(getSaves()).toEqual([]);
    });

    it('returns parsed saves from localStorage', () => {
      const saves = [
        {
          id: '1',
          name: 'Test',
          author: 'Me',
          savedAt: new Date().toISOString(),
          params: getMinimalParams(),
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
      expect(getSaves()).toHaveLength(1);
      expect(getSaves()[0].name).toBe('Test');
    });

    it('returns empty array when localStorage has invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not json');
      expect(getSaves()).toEqual([]);
    });

    it('returns empty array when stored value is not an array', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 1 }));
      expect(getSaves()).toEqual([]);
    });
  });

  describe('saveProject', () => {
    it('adds a new project and returns it', () => {
      const params = getMinimalParams();
      const saved = saveProject({ name: 'My Scarf', author: 'Leah', params });
      expect(saved.name).toBe('My Scarf');
      expect(saved.author).toBe('Leah');
      expect(saved.id).toBeDefined();
      expect(saved.savedAt).toBeDefined();
      expect(getSaves()).toHaveLength(1);
      expect(getSaves()[0].id).toBe(saved.id);
    });

    it('uses "Untitled" when name is empty', () => {
      const saved = saveProject({ name: '', params: getMinimalParams() });
      expect(saved.name).toBe('Untitled');
    });

    it('updates existing project when id is provided', () => {
      const params = getMinimalParams();
      const first = saveProject({ name: 'Original', params });
      const updated = saveProject({
        name: 'Updated',
        author: 'New Author',
        params: getMinimalParams(),
        id: first.id,
      });
      expect(updated.name).toBe('Updated');
      expect(updated.author).toBe('New Author');
      expect(updated.id).toBe(first.id);
      expect(getSaves()).toHaveLength(1);
    });
  });

  describe('deleteSave', () => {
    it('removes project by id', () => {
      const saved = saveProject({ name: 'To Delete', params: getMinimalParams() });
      expect(getSaves()).toHaveLength(1);
      deleteSave(saved.id);
      expect(getSaves()).toHaveLength(0);
    });

    it('does nothing when id does not exist', () => {
      saveProject({ name: 'Keep', params: getMinimalParams() });
      deleteSave('nonexistent-id');
      expect(getSaves()).toHaveLength(1);
    });
  });

  describe('getExportFileName', () => {
    it('returns sanitized project title with extension', () => {
      expect(getExportFileName('My Scarf Pattern', 'png')).toBe('My Scarf Pattern.png');
    });

    it('replaces invalid filename characters and appends extension', () => {
      const result = getExportFileName('Test/Pattern*.pdf', 'pdf');
      expect(result).toMatch(/^TestPattern.*\.pdf$/);
      expect(result).toBe('TestPatternpdf.pdf');
    });

    it('uses default base when projectTitle is undefined', () => {
      expect(getExportFileName(undefined, 'png')).toBe('skeinsmith-pattern.png');
    });

    it('uses default base when projectTitle is empty after trim', () => {
      expect(getExportFileName('   ', 'pdf')).toBe('skeinsmith-pattern.pdf');
    });
  });

  describe('legacy key migration', () => {
    it('reads saves from the legacy planned-pooling-saves key when the new key is empty', () => {
      const saves = [
        {
          id: 'legacy-1',
          name: 'From Old Key',
          author: 'Me',
          savedAt: new Date().toISOString(),
          params: getMinimalParams(),
        },
      ];
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(saves));
      expect(getSaves()).toHaveLength(1);
      expect(getSaves()[0].name).toBe('From Old Key');
      // Migration copies the data onto the new key
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
    });

    it('does not overwrite the new key when it already has data', () => {
      const newSaves = [
        {
          id: 'new-1',
          name: 'New',
          author: '',
          savedAt: new Date().toISOString(),
          params: getMinimalParams(),
        },
      ];
      const legacySaves = [
        {
          id: 'legacy-1',
          name: 'Legacy',
          author: '',
          savedAt: new Date().toISOString(),
          params: getMinimalParams(),
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaves));
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(legacySaves));
      expect(getSaves()[0].name).toBe('New');
    });
  });
});
