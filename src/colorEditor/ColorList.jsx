import ColorItem from './ColorItem.jsx';

const ColorList = (props) => {
  const { colorSequence, setColorSequence } = props;

  const getRandomRGBColor = () => {
    // Generate random values for red, green, and blue components
    const red = Math.floor(Math.random() * 256); // Random integer between 0 and 255
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Construct the RGB color string
    const rgbColor = `rgb(${red}, ${green}, ${blue})`;
    return rgbColor;
  };

  const newColorItem = {
    sequence: colorSequence.length + 1,
    color: getRandomRGBColor(),
    count: 5,
  };

  const addColor = (e) => {
    e.preventDefault();
    setColorSequence([...colorSequence, newColorItem]);
  };

  // Function to calculate brightness based on the RGB components
  const calculateBrightness = (r, g, b) => {
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Function to calculate text color based on background brightness
  const calculateTextColor = (color) => {
    // Extract RGB components from the color string
    const [r, g, b] = color
      .substring(4, color.length - 1)
      .split(',')
      .map(Number);
    // Calculate brightness using the extracted RGB components
    const brightness = calculateBrightness(r, g, b);
    // Determine text color based on brightness threshold
    return brightness > 128 ? 'black' : 'white';
  };

  // Callback function to update color
  const updateColorItem = (colorItem) => {
    const newSequence = colorSequence.map((color) =>
      color.sequence === colorItem.sequence ? colorItem : color
    );
    setColorSequence(newSequence);
  };

  return (
    <div>
      {colorSequence.map((color) => {
        return (
          <ColorItem
            colorItem={color}
            textColor={calculateTextColor(color.color)}
            updateColorItem={updateColorItem}
            colorSequence={colorSequence}
            setColorSequence={setColorSequence}
            key={color.sequence}
          />
        );
      })}
      <button onClick={addColor}>add color</button>
    </div>
  );
};

export default ColorList;
