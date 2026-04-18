import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { AppParams, ExportPdfOptions } from '../types';
import { getRepeatBlockSize } from './writtenPattern';

const SITE_NAME = 'Skeinsmith';

function formatStitchPattern(value: string): string {
  if (value === 'back-and-forth') return 'Back-and-forth (flat)';
  if (value === 'in-the-round') return 'In-the-round';
  return value;
}

function formatHookNeedle(params: AppParams): string | null {
  const v = params.hookNeedleSize;
  if (!v) return null;
  if (v === 'other') return params.hookNeedleSizeOther || 'Other';
  return v;
}

function formatStitchType(params: AppParams): string | null {
  const v = params.stitchType;
  if (!v) return null;
  if (v === 'other') return params.stitchTypeOther || 'Other';
  const labels: Record<string, string> = {
    'granny-cluster': 'Granny cluster',
    'moss-stitch': 'Moss stitch',
    'single-crochet': 'Single crochet',
    'half-double-crochet': 'Half double crochet',
    'double-crochet': 'Double crochet',
    'treble-crochet': 'Treble crochet',
  };
  return labels[v] ?? v;
}

export async function exportGraphAsPdf(options: ExportPdfOptions): Promise<void> {
  const {
    graphNode,
    filename = 'skeinsmith-pattern.pdf',
    params,
    projectTitle,
    projectAuthor,
    shareUrl,
    onError,
    onSuccess,
  } = options;

  if (!graphNode || !params) return;

  try {
    const gridEl = graphNode.firstElementChild || graphNode;
    const drawableCanvas =
      gridEl.tagName === 'CANVAS'
        ? (gridEl as HTMLCanvasElement)
        : gridEl.querySelector?.<HTMLCanvasElement>('canvas');

    let imgData: string;
    let widthPx: number;
    let heightPx: number;

    if (drawableCanvas) {
      widthPx = drawableCanvas.width;
      heightPx = drawableCanvas.height;
      imgData = drawableCanvas.toDataURL('image/png');
    } else {
      const captured = await html2canvas(gridEl as HTMLElement, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        logging: false,
      });
      widthPx = captured.width;
      heightPx = captured.height;
      imgData = captured.toDataURL('image/png');
    }

    const MAX_IMG_PX = 2000;
    if (drawableCanvas && (widthPx > MAX_IMG_PX || heightPx > MAX_IMG_PX)) {
      const scale = MAX_IMG_PX / Math.max(widthPx, heightPx);
      const scaledW = Math.round(widthPx * scale);
      const scaledH = Math.round(heightPx * scale);
      const off = document.createElement('canvas');
      off.width = scaledW;
      off.height = scaledH;
      const ctx = off.getContext('2d');
      if (ctx) {
        ctx.drawImage(drawableCanvas, 0, 0, widthPx, heightPx, 0, 0, scaledW, scaledH);
      }
      imgData = off.toDataURL('image/png');
      widthPx = scaledW;
      heightPx = scaledH;
    }

    const aspect = heightPx / widthPx;

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentW = pageW - margin * 2;
    const contentH = pageH - margin * 2;
    let imgW = contentW;
    let imgH = imgW * aspect;
    if (imgH > contentH) {
      imgH = contentH;
      imgW = contentH / aspect;
    }
    doc.addImage(imgData, 'PNG', margin, margin, imgW, imgH);

    let y = margin + imgH + 12;

    const ensureSpace = (needed: number): number => {
      if (y + needed > pageH - margin) {
        doc.addPage();
        return margin;
      }
      return y;
    };

    y = ensureSpace(80);
    doc.setFontSize(14);
    doc.setFont(undefined as unknown as string, 'bold');
    doc.text(SITE_NAME, margin, y);
    y += 8;

    if (projectTitle || projectAuthor) {
      doc.setFontSize(11);
      doc.setFont(undefined as unknown as string, 'normal');
      const titleAuthor = [projectTitle, projectAuthor].filter(Boolean).join(' — ');
      const titleLines = doc.splitTextToSize(titleAuthor, contentW);
      titleLines.forEach((line: string) => {
        doc.text(line, margin, y);
        y += 6;
      });
    }

    y = ensureSpace(100);
    doc.setFontSize(10);
    doc.setFont(undefined as unknown as string, 'bold');
    doc.text('Settings', margin, y);
    y += 5;
    doc.setFont(undefined as unknown as string, 'normal');
    const settingsLines = [
      `Stitches per row: ${params.graphLength}`,
      `Number of rows: ${params.graphHeight}`,
      `Stitch pattern: ${formatStitchPattern(params.stitchPattern)}`,
      `Gridlines: ${params.showGridlines ? 'On' : 'Off'}`,
    ];
    settingsLines.forEach((text) => {
      doc.splitTextToSize(text, contentW).forEach((line: string) => {
        doc.text(line, margin, y);
        y += 5;
      });
    });
    const hookNeedle = formatHookNeedle(params);
    if (hookNeedle) {
      y = ensureSpace(25);
      doc.splitTextToSize(`Hook/needle: ${hookNeedle}`, contentW).forEach((line: string) => {
        doc.text(line, margin, y);
        y += 5;
      });
    }
    const stitchType = formatStitchType(params);
    if (stitchType) {
      y = ensureSpace(25);
      doc.splitTextToSize(`Stitch type: ${stitchType}`, contentW).forEach((line: string) => {
        doc.text(line, margin, y);
        y += 5;
      });
    }
    if (params.lotNumber) {
      y = ensureSpace(25);
      doc.splitTextToSize(`Lot number: ${String(params.lotNumber)}`, contentW).forEach((line: string) => {
        doc.text(line, margin, y);
        y += 5;
      });
    }
    const yarnParts = [params.yarnBrand, params.yarnName, params.yarnColorway].filter(Boolean);
    if (yarnParts.length) {
      y = ensureSpace(25);
      doc.splitTextToSize(`Yarn: ${yarnParts.join(' — ')}`, contentW).forEach((line: string) => {
        doc.text(line, margin, y);
        y += 5;
      });
    }
    y += 8;
    if (params.notes) {
      const notesLines = doc.splitTextToSize(String(params.notes), contentW);
      y = ensureSpace(20 + notesLines.length * 5);
      doc.setFont(undefined as unknown as string, 'bold');
      doc.text('Notes', margin, y);
      y += 5;
      doc.setFont(undefined as unknown as string, 'normal');
      notesLines.forEach((line: string) => {
        doc.text(line, margin, y);
        y += 5;
      });
      y += 8;
    }

    const colorList = params.colorSequence ?? [];
    const colorBlockHeight =
      10 +
      colorList.reduce((sum, c) => {
        const parts = [c.name, c.hex].filter(Boolean);
        const label = parts.length ? parts.join(' ') : `Color ${c.sequence}`;
        const colorText = `${label}: ${c.count} stitches`;
        return sum + doc.splitTextToSize(colorText, contentW).length * 5;
      }, 0);
    y = ensureSpace(colorBlockHeight);
    doc.setFont(undefined as unknown as string, 'bold');
    doc.text('Colors', margin, y);
    y += 5;
    doc.setFont(undefined as unknown as string, 'normal');
    (params.colorSequence ?? []).forEach((c) => {
      const parts = [c.name, c.hex].filter(Boolean);
      const label = parts.length ? parts.join(' ') : `Color ${c.sequence}`;
      const colorText = `${label}: ${c.count} stitches`;
      doc.splitTextToSize(colorText, contentW).forEach((line: string) => {
        doc.text(line, margin, y);
        y += 5;
      });
    });
    y += 8;

    const writtenRows = options.writtenPatternRows;
    if (writtenRows && writtenRows.length > 0) {
      const repeatBlockSize = getRepeatBlockSize(writtenRows);
      const rowsForPdf = repeatBlockSize
        ? writtenRows.slice(0, repeatBlockSize)
        : writtenRows;

      doc.setFontSize(10);
      doc.setFont(undefined as unknown as string, 'bold');
      y = ensureSpace(12);
      doc.text('Written pattern (row by row)', margin, y);
      y += 6;
      doc.setFont(undefined as unknown as string, 'normal');
      doc.setFontSize(8);
      rowsForPdf.forEach((row) => {
        const text = `Row ${row.rowNumber}: ${row.line}`;
        const lines = doc.splitTextToSize(text, contentW);
        const blockH = lines.length * 4 + 1;
        y = ensureSpace(blockH);
        lines.forEach((line: string) => {
          doc.text(line, margin, y);
          y += 4;
        });
      });

      if (repeatBlockSize) {
        y = ensureSpace(8);
        doc.setFontSize(9);
        doc.text(
          `Repeat rows 1-${repeatBlockSize} until desired length is reached`,
          margin,
          y
        );
        y += 6;
      }

      doc.setFontSize(10);
      y += 6;
    }

    const qrSize = 25;
    const urlLines = doc.splitTextToSize(shareUrl ?? window.location.href, contentW);
    const qrBlockHeight = qrSize + 15 + urlLines.length * 5;
    y = ensureSpace(qrBlockHeight);

    const qrDataUrl = await QRCode.toDataURL(shareUrl ?? window.location.href, {
      width: 120,
      margin: 1,
    });
    doc.addImage(qrDataUrl, 'PNG', margin, y, qrSize, qrSize);
    doc.setFontSize(9);
    doc.text('Scan to open this pattern', margin, y + qrSize + 5);
    let urlY = y + qrSize + 10;
    urlLines.forEach((line: string) => {
      doc.text(line, margin, urlY);
      urlY += 5;
    });

    doc.save(filename);
    onSuccess?.();
  } catch (err) {
    console.error('PDF export failed:', err);
    onError?.();
  }
}
