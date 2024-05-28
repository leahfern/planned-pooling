// Helper function to determine the best contrast text color
const getContrastTextColor = (hexColor) => {
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const getColorDetails = async (hexColor) => {
  try {
    //if first character of hexColor string is #, remove it
    if (hexColor[0] === '#') {
      hexColor = hexColor.slice(1);
    }
    // Fetch color details from the API
    const response = await fetch(
      `https://api.color.pizza/v1/?values=${hexColor}`
    );
    const data = await response.json();

    // The API returns an array of colors, we're interested in the first one
    const colorItem = data.colors[0];

    // Check each item and provide a default value if necessary
    const name = colorItem.name || `#${hexColor}`;
    const hex = colorItem.hex || `#${hexColor}`;
    const textColor = colorItem.bestContrast || getContrastTextColor(hexColor);

    return { name, hex, textColor };
  } catch (error) {
    console.error('Failed to fetch color details:', error);
    // Return default values
    return {
      name: `#${hexColor}`,
      hex: `#${hexColor}`,
      textColor: getContrastTextColor(hexColor),
    };
  }
};

export default getColorDetails;
