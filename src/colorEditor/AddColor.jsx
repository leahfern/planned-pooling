import React from 'react';
import { getRandomRGBColor } from '../utils/colorUtils.js';

const AddColor = ({ colorSequence, setColorSequence }) => {
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
