import React from 'react';
import { getRandomColor } from '../utils/colorUtils.js';
import getColorDetails from '../api/colorDetails.js';

const AddColor = ({ colorSequence, setColorSequence }) => {
  const generateNewColor = async () => {
    const numStitches = Math.floor(Math.random() * 5) + 1;
    const randomColor = getRandomColor();
    const colorDetails = await getColorDetails(randomColor);
    return {
      sequence: colorSequence.length + 1,
      count: numStitches,
      ...colorDetails,
    };
  };

  const addColor = async (e) => {
    e.preventDefault();
    setColorSequence([...colorSequence, await generateNewColor()]);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={addColor}>Add a color</button>
    </div>
  );
};

export default AddColor;
