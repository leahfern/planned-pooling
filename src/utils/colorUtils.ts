export const getRandomColor = (): string => {
  const getRandomHexComponent = (): string =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');

  const red = getRandomHexComponent();
  const green = getRandomHexComponent();
  const blue = getRandomHexComponent();
  return `#${red}${green}${blue}`;
};
