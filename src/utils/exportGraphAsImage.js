import html2canvas from 'html2canvas';

export async function exportGraphAsImage(node, filename = 'planned-pooling-pattern.png') {
  if (!node) return;
  try {
    const gridEl = node.firstElementChild || node;
    const canvas = await html2canvas(gridEl, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
      logging: false,
    });
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Image export failed:', err);
    alert('Failed to export image');
  }
}
