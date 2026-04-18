import { getSavedYarns, saveYarn, deleteYarn } from './useSavedYarns';
import type { ColorSequenceItem } from '../types';

const STORAGE_KEY = 'skeinsmith-yarns';
const LEGACY_STORAGE_KEY = 'planned-pooling-yarns';

describe('useSavedYarns', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  });

  describe('getSavedYarns', () => {
    it('returns empty array when no yarns', () => {
      expect(getSavedYarns()).toEqual([]);
    });

    it('returns parsed yarns from localStorage', () => {
      const yarns = [
        {
          id: '1',
          brand: 'Red Heart',
          name: 'Super Saver',
          colorway: 'Cherry',
          colorSequence: [],
          savedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(yarns));
      expect(getSavedYarns()).toHaveLength(1);
      expect(getSavedYarns()[0].brand).toBe('Red Heart');
    });

    it('returns empty array when localStorage has invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not json');
      expect(getSavedYarns()).toEqual([]);
    });
  });

  describe('saveYarn', () => {
    it('adds a new yarn and returns it', () => {
      const saved = saveYarn({
        brand: 'Red Heart',
        name: 'Super Saver',
        colorway: 'Cherry Red',
      });
      expect(saved.brand).toBe('Red Heart');
      expect(saved.name).toBe('Super Saver');
      expect(saved.colorway).toBe('Cherry Red');
      expect(saved.id).toBeDefined();
      expect(saved.savedAt).toBeDefined();
      expect(saved.colorSequence).toEqual([]);
      expect(getSavedYarns()).toHaveLength(1);
    });

    it('stores colorSequence when provided', () => {
      const seq: ColorSequenceItem[] = [
        { sequence: 1, hex: '#ff0000', count: 3, textColor: '#fff', name: 'Red' },
      ];
      const saved = saveYarn({ brand: 'Test', colorSequence: seq });
      expect(saved.colorSequence).toEqual(seq);
    });

    it('trims brand, name, colorway', () => {
      const saved = saveYarn({
        brand: '  Red Heart  ',
        name: '  Super Saver  ',
        colorway: '  Cherry  ',
      });
      expect(saved.brand).toBe('Red Heart');
      expect(saved.name).toBe('Super Saver');
      expect(saved.colorway).toBe('Cherry');
    });
  });

  describe('deleteYarn', () => {
    it('removes yarn by id', () => {
      const saved = saveYarn({ brand: 'A', name: 'B', colorway: 'C' });
      expect(getSavedYarns()).toHaveLength(1);
      deleteYarn(saved.id);
      expect(getSavedYarns()).toHaveLength(0);
    });
  });

  describe('legacy key migration', () => {
    it('reads yarns from the legacy planned-pooling-yarns key when the new key is empty', () => {
      const yarns = [
        {
          id: 'legacy-1',
          brand: 'Old',
          name: 'Brand',
          colorway: 'Blue',
          colorSequence: [],
          savedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(yarns));
      expect(getSavedYarns()).toHaveLength(1);
      expect(getSavedYarns()[0].brand).toBe('Old');
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
    });
  });
});
