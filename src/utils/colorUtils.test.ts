import { getRandomColor } from './colorUtils';

describe('colorUtils', () => {
  describe('getRandomColor', () => {
    it('returns a 7-char #RRGGBB string with valid hex bytes', () => {
      const color = getRandomColor();
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
      const n = parseInt(color.slice(1), 16);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(0xffffff);
    });

    it('returns a variety of colors across calls (not a single constant)', () => {
      const colors = new Set<string>();
      for (let i = 0; i < 30; i++) {
        colors.add(getRandomColor());
      }
      expect(colors.size).toBeGreaterThan(1);
    });
  });
});
