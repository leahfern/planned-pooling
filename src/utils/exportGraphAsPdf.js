import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

const SITE_NAME = 'Planned Pooling Helper';

function formatStitchPattern(value) {
  if (value === 'back-and-forth') return 'Back-and-forth (flat)';
  if (value === 'in-the-round') return 'In-the-round';
  return value;
}

function formatHookNeedle(params) {
  const v = params.hookNeedleSize;
  if (!v) return null;
  if (v === 'other') return params.hookNeedleSizeOther || 'Other';
  return v;
}

function formatStitchType(params) {
  const v = params.stitchType;
  if (!v) return null;
  if (v === 'other') return params.stitchTypeOther || 'Other';
  const labels = {
    'granny-cluster': 'Granny cluster',
    'moss-stitch': 'Moss stitch',
    'single-crochet': 'Single crochet',
    'half-double-crochet': 'Half double crochet',
    'double-crochet': 'Double crochet',
    'treble-crochet': 'Treble crochet',
  };
  return labels[v] || v;
}

export async function exportGraphAsPdf(options) {
  const {
    graphNode,
    filename = 'planned-pooling-pattern.pdf',
    params,
    projectTitle,
    projectAuthor,
    shareUrl,
  } = options;

  if (!graphNode || !params) return;

  try {
    const gridEl = graphNode.firstElementChild || graphNode;
    const canvas = await html2canvas(gridEl, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
      logging: false,
    });
    const imgData = canvas.toDataURL('image/png');

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentW = pageW - margin * 2;
    const contentH = pageH - margin * 2;

    const aspect = canvas.height / canvas.width;
    let imgW = contentW;
    let imgH = imgW * aspect;
    if (imgH > contentH) {
      imgH = contentH;
      imgW = contentH / aspect;
    }
    doc.addImage(imgData, 'PNG', margin, margin, imgW, imgH);

    let y = margin + imgH + 12;

    if (y > pageH - 80) {
      doc.addPage();
      y = margin;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(SITE_NAME, margin, y);
    y += 8;

    if (projectTitle || projectAuthor) {
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text([projectTitle, projectAuthor].filter(Boolean).join(' — '), margin, y);
      y += 6;
    }

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Settings', margin, y);
    y += 5;
    doc.setFont(undefined, 'normal');
    doc.text(`Stitches per row: ${params.graphLength}`, margin, y);
    y += 5;
    doc.text(`Number of rows: ${params.graphHeight}`, margin, y);
    y += 5;
    doc.text(`Stitch pattern: ${formatStitchPattern(params.stitchPattern)}`, margin, y);
    y += 5;
    doc.text(`Gridlines: ${params.showGridlines ? 'On' : 'Off'}`, margin, y);
    const hookNeedle = formatHookNeedle(params);
    if (hookNeedle) {
      y += 5;
      doc.text(`Hook/needle: ${hookNeedle}`, margin, y);
    }
    const stitchType = formatStitchType(params);
    if (stitchType) {
      y += 5;
      doc.text(`Stitch type: ${stitchType}`, margin, y);
    }
    if (params.lotNumber) {
      y += 5;
      doc.text(`Lot number: ${params.lotNumber}`, margin, y);
    }
    const yarnParts = [params.yarnBrand, params.yarnName, params.yarnColorway].filter(Boolean);
    if (yarnParts.length) {
      y += 5;
      doc.text(`Yarn: ${yarnParts.join(' — ')}`, margin, y);
    }
    y += 8;
    if (params.notes) {
      doc.setFont(undefined, 'bold');
      doc.text('Notes', margin, y);
      y += 5;
      doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(params.notes, contentW);
      lines.forEach((line) => {
        doc.text(line, margin, y);
        y += 5;
      });
      y += 8;
    }

    doc.setFont(undefined, 'bold');
    doc.text('Colors', margin, y);
    y += 5;
    doc.setFont(undefined, 'normal');
    (params.colorSequence || []).forEach((c) => {
      const parts = [c.name, c.hex].filter(Boolean);
      const label = parts.length ? parts.join(' ') : `Color ${c.sequence}`;
      doc.text(`${label}: ${c.count} stitches`, margin, y);
      y += 5;
    });
    y += 8;

    const qrDataUrl = await QRCode.toDataURL(shareUrl || window.location.href, {
      width: 120,
      margin: 1,
    });
    const qrSize = 25;
    doc.addImage(qrDataUrl, 'PNG', margin, y, qrSize, qrSize);
    doc.setFontSize(9);
    doc.text('Scan to open this pattern', margin, y + qrSize + 5);
    doc.text(shareUrl || window.location.href, margin, y + qrSize + 10);

    doc.save(filename);
  } catch (err) {
    console.error('PDF export failed:', err);
    alert('Failed to export PDF');
  }
}
