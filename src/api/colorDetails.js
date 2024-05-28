const getColorDetails = async (hexColor) => {
  //if first character of hexColor string is #, remove it
  if (hexColor[0] === '#') {
    hexColor = hexColor.slice(1);
  }
  const response = await fetch(
    `https://api.color.pizza/v1/?values=${hexColor}`
  );
  const data = await response.json();

  // The API returns an array of colors, we're interested in the first one
  const colorItem = data.colors[0];
  return {
    name: colorItem.name,
    hex: colorItem.hex,
    textColor: colorItem.bestContrast,
  };
};

export default getColorDetails;
