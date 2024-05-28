export const getRandomColor = () => {
  // Generate a random integer between 0 and 255, convert it to a hexadecimal string, and pad it with zeros if necessary
  const getRandomHexComponent = () => {
    return Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
  };

  // Generate random values for red, green, and blue components
  const red = getRandomHexComponent();
  const green = getRandomHexComponent();
  const blue = getRandomHexComponent();

  // Construct the HEX color string
  const hexColor = `#${red}${green}${blue}`;
  return hexColor;
};
