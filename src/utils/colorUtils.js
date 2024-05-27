export function getTextColor(backgroundColor) {
  const calculateBrightness = (r, g, b) => {
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Extract RGB components from the color string
  const [r, g, b] = backgroundColor
    .substring(4, backgroundColor.length - 1)
    .split(',')
    .map(Number);
  // Calculate brightness using the extracted RGB components
  const brightness = calculateBrightness(r, g, b);
  // Determine text color based on brightness threshold
  return brightness > 128 ? 'black' : 'white';
}

export function rgbToHex(rgb) {
  console.log('leah, rgb', rgb);
  const [r, g, b] = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1);
  return '#' + ((1 << 24) + (+r << 16) + (+g << 8) + +b).toString(16).slice(1);
}

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )})`
    : null;
};
