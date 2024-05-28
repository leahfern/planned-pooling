import React, { useState, useEffect } from 'react';
import Row from './Row';

const Graph = ({
  width,
  height,
  showGridlines,
  colorSequence,
  stitchPattern,
}) => {
  // State to keep track of the repeated color sequence
  const [repeatedColorSequence, setRepeatedColorSequence] = useState([]);

  // Recalculate the repeated color sequence whenever the colorSequence, width, or height props change
  useEffect(() => {
    let newRepeatedColorSequence = [];
    while (newRepeatedColorSequence.length < width * height) {
      for (const colorInfo of colorSequence) {
        newRepeatedColorSequence = [
          ...newRepeatedColorSequence,
          ...Array(colorInfo.count).fill(colorInfo.hex),
        ];
      }
    }
    setRepeatedColorSequence(newRepeatedColorSequence);
  }, [colorSequence, width, height]);

  // Generate rows
  const rows = [];

  // Fill rows with colors from the repeated color sequence
  for (let i = 0; i < height; i++) {
    const startIndex = i * width;
    const endIndex = (i + 1) * width;
    let rowColors = repeatedColorSequence.slice(startIndex, endIndex);

    // If back and forth, reverse the order of colors for even rows
    if (stitchPattern === 'back-and-forth' && i % 2 === 1) {
      rowColors = rowColors.reverse();
    }

    rows.push(
      <Row
        key={i}
        width={width}
        colors={rowColors}
        showGridlines={showGridlines}
        showTopBorder={i === 0}
      />
    );
  }

  // Render the rows
  return (
    <div
      style={{
        display: 'flex',
        width: 500,
        flexDirection: 'column',
      }}
    >
      {rows}
    </div>
  );
};

export default Graph;
