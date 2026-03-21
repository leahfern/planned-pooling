import {
  INPUT_LIMITS,
  HOOK_NEEDLE_SIZES,
  STITCH_TYPES,
} from './projectMetadata';

describe('projectMetadata', () => {
  it('INPUT_LIMITS has positive numbers for every form field', () => {
    const keys = [
      'projectName',
      'author',
      'notes',
      'lotNumber',
      'hookNeedleOther',
      'stitchTypeOther',
      'yarnBrand',
      'yarnName',
      'yarnColorway',
    ] as const;
    keys.forEach((k) => {
      expect(INPUT_LIMITS[k]).toBeDefined();
      expect(typeof INPUT_LIMITS[k]).toBe('number');
      expect(INPUT_LIMITS[k]).toBeGreaterThan(0);
    });
  });

  it('hook and stitch dropdowns include placeholder, other, and valid options', () => {
    const hookValues = HOOK_NEEDLE_SIZES.map((e) => e.value);
    const stitchValues = STITCH_TYPES.map((e) => e.value);
    expect(hookValues).toEqual(expect.arrayContaining(['', 'other']));
    expect(stitchValues).toEqual(expect.arrayContaining(['', 'other']));
    HOOK_NEEDLE_SIZES.forEach((e) => {
      expect(e).toHaveProperty('label');
      expect(typeof e.label).toBe('string');
    });
    STITCH_TYPES.forEach((e) => {
      expect(e).toHaveProperty('label');
      expect(typeof e.label).toBe('string');
    });
  });
});
