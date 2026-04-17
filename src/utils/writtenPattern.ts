import type { ColorSequenceItem, WrittenPatternRow } from '../types';
import { getGridRowsAsHex } from './poolingGrid';

function hexToLabel(hex: string, colorSequence: ColorSequenceItem[]): string {
  const normalized = hex.toLowerCase();
  const item = colorSequence.find((c) => c.hex.toLowerCase() === normalized);
  if (item?.name?.trim()) return item.name.trim();
  return hex;
}

/**
 * Run-length encode a row of hex values into "3 Teal, 7 Terracotta, …"
 */
export function formatRowSegments(
  rowHexes: string[],
  colorSequence: ColorSequenceItem[]
): string {
  if (rowHexes.length === 0) return '';
  const parts: string[] = [];
  let runHex = rowHexes[0];
  let count = 1;
  for (let i = 1; i < rowHexes.length; i++) {
    if (rowHexes[i] === runHex) {
      count++;
    } else {
      parts.push(`${count} ${hexToLabel(runHex, colorSequence)}`);
      runHex = rowHexes[i];
      count = 1;
    }
  }
  parts.push(`${count} ${hexToLabel(runHex, colorSequence)}`);
  return parts.join(', ');
}

/**
 * Human-readable row-by-row instructions matching the on-screen grid.
 */
export function buildWrittenPattern(
  length: number,
  height: number,
  colorSequence: ColorSequenceItem[],
  stitchPattern: string
): WrittenPatternRow[] {
  const gridRows = getGridRowsAsHex(length, height, colorSequence, stitchPattern);
  return gridRows.map((rowHexes, i) => ({
    rowNumber: i + 1,
    line: formatRowSegments(rowHexes, colorSequence),
  }));
}

export function getRepeatBlockSize(rows: WrittenPatternRow[]): number | null {
  const totalRows = rows.length;
  if (totalRows < 2) return null;

  for (let blockSize = 1; blockSize < totalRows; blockSize++) {
    let isRepeat = true;
    for (let i = 0; i < totalRows; i++) {
      if (rows[i].line !== rows[i % blockSize].line) {
        isRepeat = false;
        break;
      }
    }
    if (isRepeat) return blockSize;
  }

  return null;
}

export function formatWrittenPatternForDisplay(rows: WrittenPatternRow[]): string {
  if (rows.length === 0) return '';

  const repeatBlockSize = getRepeatBlockSize(rows);
  if (!repeatBlockSize) {
    return rows.map((row) => `Row ${row.rowNumber}: ${row.line}`).join('\n');
  }

  const firstBlockText = rows
    .slice(0, repeatBlockSize)
    .map((row) => `Row ${row.rowNumber}: ${row.line}`)
    .join('\n');

  return `${firstBlockText}\n\nRepeat rows 1-${repeatBlockSize} until desired length is reached`;
}
