// Helper function to determine the best contrast text color
const getContrastTextColor = (hexColor) => {
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const getColorDetails = async (hexColor) => {
  if (typeof hexColor !== 'string') {
    return { name: '#000000', hex: '#000000', textColor: '#FFFFFF' };
  }
  let normalized = hexColor.trim();
  if (normalized.startsWith('#')) {
    normalized = normalized.slice(1);
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) {
    const hex = hexColor.startsWith('#') ? hexColor : `#${hexColor}`;
    return {
      name: hex,
      hex,
      textColor: getContrastTextColor('000000'),
    };
  }
  try {
    const response = await fetch(
      `https://api.color.pizza/v1/?values=${normalized}`
    );
    const data = await response.json();

    // The API returns an array of colors, we're interested in the first one
    const colorItem = data.colors[0];

    // Check each item and provide a default value if necessary
    const name = colorItem.name || `#${normalized}`;
    const hex = colorItem.hex || `#${normalized}`;
    const textColor = colorItem.bestContrast || getContrastTextColor(normalized);

    return { name, hex, textColor };
  } catch (error) {
    console.error('Failed to fetch color details:', error);
    const hex = `#${normalized}`;
    return {
      name: hex,
      hex,
      textColor: getContrastTextColor(normalized),
    };
  }
};

export default getColorDetails;
