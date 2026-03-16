/** Max lengths for text inputs to keep URLs and localStorage safe and UX reasonable */
export const INPUT_LIMITS: Record<string, number> = {
  projectName: 200,
  author: 100,
  notes: 3000,
  lotNumber: 100,
  hookNeedleOther: 50,
  stitchTypeOther: 50,
  yarnBrand: 100,
  yarnName: 100,
  yarnColorway: 100,
};

export const HOOK_NEEDLE_SIZES: { value: string; label: string }[] = [
  { value: '', label: '—' },
  { value: '2.25mm (B/1)', label: '2.25 mm (B/1)' },
  { value: '2.75mm (C/2)', label: '2.75 mm (C/2)' },
  { value: '3.25mm (D/3)', label: '3.25 mm (D/3)' },
  { value: '3.5mm (E/4)', label: '3.5 mm (E/4)' },
  { value: '3.75mm (F/5)', label: '3.75 mm (F/5)' },
  { value: '4mm (G/6)', label: '4 mm (G/6)' },
  { value: '4.5mm (7)', label: '4.5 mm (7)' },
  { value: '5mm (H/8)', label: '5 mm (H/8)' },
  { value: '5.5mm (I/9)', label: '5.5 mm (I/9)' },
  { value: '6mm (J/10)', label: '6 mm (J/10)' },
  { value: '6.5mm (K/10.5)', label: '6.5 mm (K/10.5)' },
  { value: '8mm (L/11)', label: '8 mm (L/11)' },
  { value: '9mm (M/13)', label: '9 mm (M/13)' },
  { value: '10mm (N/15)', label: '10 mm (N/15)' },
  { value: 'other', label: 'Other (enter below)' },
];

export const STITCH_TYPES: { value: string; label: string }[] = [
  { value: '', label: '—' },
  { value: 'granny-cluster', label: 'Granny cluster' },
  { value: 'moss-stitch', label: 'Moss stitch' },
  { value: 'single-crochet', label: 'Single crochet' },
  { value: 'half-double-crochet', label: 'Half double crochet' },
  { value: 'double-crochet', label: 'Double crochet' },
  { value: 'treble-crochet', label: 'Treble crochet' },
  { value: 'other', label: 'Other (enter below)' },
];
