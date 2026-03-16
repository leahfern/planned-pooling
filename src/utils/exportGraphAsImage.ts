import html2canvas from 'html2canvas';
import type { ExportImageOptions } from '../types';

export async function exportGraphAsImage(
  node: HTMLElement | null,
  filename = 'planned-pooling-pattern.png',
  options: ExportImageOptions = {}
): Promise<void> {
  const { onError, onSuccess } = options;
  if (!node) return;
  try {
    const gridEl = node.firstElementChild || node;
    const drawableCanvas =
      gridEl.tagName === 'CANVAS'
        ? (gridEl as HTMLCanvasElement)
        : gridEl.querySelector?.<HTMLCanvasElement>('canvas');

    let dataUrl: string;
    if (drawableCanvas) {
      dataUrl = drawableCanvas.toDataURL('image/png');
    } else {
      const captured = await html2canvas(gridEl as HTMLElement, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        logging: false,
      });
      dataUrl = captured.toDataURL('image/png');
    }

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    onSuccess?.();
  } catch (err) {
    console.error('Image export failed:', err);
    onError?.();
  }
}
