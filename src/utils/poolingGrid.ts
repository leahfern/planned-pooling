import type { ColorSequenceItem } from '../types';

/**
 * Flat list of hex colors filling the grid (row-major), before per-row reversal.
 */
export function buildRepeatedColorSequence(
  colorSequence: ColorSequenceItem[],
  length: number,
  height: number
): string[] {
  const total = length * height;
  const result: string[] = [];
  while (result.length < total) {
    for (const colorInfo of colorSequence) {
      for (let c = 0; c < colorInfo.count; c++) {
        result.push(colorInfo.hex || '#e0e0e0');
      }
    }
  }
  return result.slice(0, total);
}

/**
 * Hex values for one visual row (after back-and-forth reversal when applicable).
 */
export function getRowHexes(
  rowIndex: number,
  length: number,
  repeatedSequence: string[],
  stitchPattern: string
): string[] {
  const startIndex = rowIndex * length;
  let rowColors = repeatedSequence.slice(startIndex, startIndex + length);
  if (stitchPattern === 'back-and-forth' && rowIndex % 2 === 1) {
    rowColors = [...rowColors].reverse();
  }
  return rowColors;
}

/**
 * All rows as hex arrays (matches Graph / GraphCanvas display order).
 */
export function getGridRowsAsHex(
  length: number,
  height: number,
  colorSequence: ColorSequenceItem[],
  stitchPattern: string
): string[][] {
  const repeated = buildRepeatedColorSequence(colorSequence, length, height);
  const rows: string[][] = [];
  for (let r = 0; r < height; r++) {
    rows.push(getRowHexes(r, length, repeated, stitchPattern));
  }
  return rows;
}
