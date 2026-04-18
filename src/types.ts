/**
 * Shared TypeScript types for the Skeinsmith app.
 */

export interface ColorSequenceItem {
  sequence: number;
  hex: string;
  count: number;
  textColor: string;
  name: string;
}

export interface AppParams {
  graphLength: number;
  graphHeight: number;
  showGridlines: boolean;
  /** When true, the row tracker highlights the active row on the grid canvas. */
  highlightCurrentRowOnGrid: boolean;
  stitchPattern: string;
  colorSequence: ColorSequenceItem[];
  showSidePanel: boolean;
  zoom: number;
  hookNeedleSize: string;
  hookNeedleSizeOther: string;
  stitchType: string;
  stitchTypeOther: string;
  lotNumber: string;
  notes: string;
  yarnBrand: string;
  yarnName: string;
  yarnColorway: string;
}

export type ColorScheme = 'light' | 'dark';

export interface ColorDetailsResult {
  name: string;
  hex: string;
  textColor: string;
}

export interface SavedProject {
  id: string;
  name: string;
  author: string;
  savedAt: string;
  params: AppParams;
}

export interface SavedYarn {
  id: string;
  brand: string;
  name: string;
  colorway: string;
  colorSequence: ColorSequenceItem[];
  savedAt: string;
}

export interface ExportImageOptions {
  onError?: () => void;
  onSuccess?: () => void;
}

/** One line of the human-readable row-by-row pattern. */
export interface WrittenPatternRow {
  rowNumber: number;
  line: string;
}

export interface ExportPdfOptions {
  graphNode: HTMLElement | null;
  filename?: string;
  params: AppParams;
  projectTitle?: string;
  projectAuthor?: string;
  shareUrl?: string;
  /** Optional row-by-row text (e.g. "3 Teal, 7 Terracotta") appended to the PDF. */
  writtenPatternRows?: WrittenPatternRow[];
  onError?: () => void;
  onSuccess?: () => void;
}
