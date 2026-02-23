import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Row from './Row';

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
`;

const Graph = ({
  length,
  height,
  showGridlines,
  colorSequence,
  stitchPattern,
  zoom = 1,
}) => {
  // State to keep track of the repeated color sequence
  const [repeatedColorSequence, setRepeatedColorSequence] = useState([]);

  // Recalculate the repeated color sequence whenever the colorSequence, length, or height props change
  useEffect(() => {
    let newRepeatedColorSequence = [];
    while (newRepeatedColorSequence.length < length * height) {
      for (const colorInfo of colorSequence) {
        newRepeatedColorSequence = [
          ...newRepeatedColorSequence,
          ...Array(colorInfo.count).fill(colorInfo.hex),
        ];
      }
    }
    setRepeatedColorSequence(newRepeatedColorSequence);
  }, [colorSequence, length, height]);

  // Generate rows
  const rows = [];

  // Fill rows with colors from the repeated color sequence
  for (let i = 0; i < height; i++) {
    const startIndex = i * length;
    const endIndex = (i + 1) * length;
    let rowColors = repeatedColorSequence.slice(startIndex, endIndex);

    // If back and forth, reverse the order of colors for even rows
    if (stitchPattern === 'back-and-forth' && i % 2 === 1) {
      rowColors = rowColors.reverse();
    }

    rows.push(
      <Row
        key={i}
        length={length}
        colors={rowColors}
        showGridlines={showGridlines}
        showTopBorder={i === 0}
        zoom={zoom}
      />
    );
  }

  // Render the rows
  return <GraphContainer>{rows}</GraphContainer>;
};

export default Graph;
