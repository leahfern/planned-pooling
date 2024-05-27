import React from 'react';

const AddColor = ({ colorSequence, setColorSequence }) => {
  const getRandomRGBColor = () => {
    // Generate random values for red, green, and blue components
    const red = Math.floor(Math.random() * 256); // Random integer between 0 and 255
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Construct the RGB color string
    const rgbColor = `rgb(${red}, ${green}, ${blue})`;
    return rgbColor;
  };

  const numStitches = Math.floor(Math.random() * 5) + 1;

  const newColorItem = {
    sequence: colorSequence.length + 1,
    color: getRandomRGBColor(),
    count: numStitches,
  };

  const addColor = (e) => {
    e.preventDefault();
    setColorSequence([...colorSequence, newColorItem]);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={addColor}>Add a color</button>
    </div>
  );
};

export default AddColor;
