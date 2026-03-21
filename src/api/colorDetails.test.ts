import getColorDetails from './colorDetails';

describe('colorDetails', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe('invalid or short hex', () => {
    it('returns fallback for empty string', async () => {
      const result = await getColorDetails('');
      expect(result.hex).toBe('#');
      expect(result.name).toBe('#');
      expect(result.textColor).toBe('#FFFFFF');
    });

    it('returns fallback for invalid hex (not 6 digits)', async () => {
      const result = await getColorDetails('abc');
      expect(result.hex).toBe('#abc');
      expect(result.name).toBe('#abc');
      expect(result.textColor).toBe('#FFFFFF');
    });

    it('normalizes hex without leading #', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ colors: [{ name: 'Black', hex: '#000000', bestContrast: '#FFFFFF' }] }),
      });
      const result = await getColorDetails('000000');
      expect(result.hex).toBe('#000000');
      expect(fetch).toHaveBeenCalledWith('https://api.color.pizza/v1/?values=000000');
    });

    it('trims whitespace', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ colors: [{ name: 'White', hex: '#FFFFFF', bestContrast: '#000000' }] }),
      });
      await getColorDetails('  ffffff  ');
      expect(fetch).toHaveBeenCalledWith('https://api.color.pizza/v1/?values=ffffff');
    });
  });

  describe('API success', () => {
    it('returns name, hex, textColor from API', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          colors: [
            { name: 'Teal', hex: '#008080', bestContrast: '#FFFFFF' },
          ],
        }),
      });
      const result = await getColorDetails('#008080');
      expect(result).toEqual({
        name: 'Teal',
        hex: '#008080',
        textColor: '#FFFFFF',
      });
    });

    it('uses fallbacks when API returns empty colors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ colors: [] }),
      });
      const result = await getColorDetails('008080');
      expect(result.hex).toBe('#008080');
      expect(result.name).toBe('#008080');
      expect(result.textColor).toBe('#FFFFFF');
    });
  });

  describe('API error', () => {
    it('returns local fallback on fetch failure', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      const result = await getColorDetails('008080');
      expect(result).toEqual({
        name: '#008080',
        hex: '#008080',
        textColor: '#FFFFFF',
      });
      spy.mockRestore();
    });
  });
});
