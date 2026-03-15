import html2canvas from 'html2canvas';

export async function exportGraphAsImage(node, filename = 'planned-pooling-pattern.png', options = {}) {
  const { onError, onSuccess } = options;
  if (!node) return;
  try {
    const gridEl = node.firstElementChild || node;
    const drawableCanvas =
      gridEl.tagName === 'CANVAS' ? gridEl : gridEl.querySelector?.('canvas');

    let dataUrl;
    if (drawableCanvas) {
      dataUrl = drawableCanvas.toDataURL('image/png');
    } else {
      const captured = await html2canvas(gridEl, {
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
