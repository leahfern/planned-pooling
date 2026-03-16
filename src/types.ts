/**
 * Shared TypeScript types for the Planned Pooling app.
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

export interface ExportPdfOptions {
  graphNode: HTMLElement | null;
  filename?: string;
  params: AppParams;
  projectTitle?: string;
  projectAuthor?: string;
  shareUrl?: string;
  onError?: () => void;
  onSuccess?: () => void;
}
