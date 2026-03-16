import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Row from './Row';
import type { ColorSequenceItem } from '../types';

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
`;

interface GraphProps {
  length: number;
  height: number;
  showGridlines?: boolean;
  colorSequence: ColorSequenceItem[];
  stitchPattern: string;
  zoom?: number;
}

const Graph: React.FC<GraphProps> = ({
  length,
  height,
  showGridlines,
  colorSequence,
  stitchPattern,
  zoom = 1,
}) => {
  const [repeatedColorSequence, setRepeatedColorSequence] = useState<string[]>([]);

  useEffect(() => {
    const newRepeatedColorSequence: string[] = [];
    while (newRepeatedColorSequence.length < length * height) {
      for (const colorInfo of colorSequence) {
        newRepeatedColorSequence.push(
          ...Array(colorInfo.count).fill(colorInfo.hex)
        );
      }
    }
    setRepeatedColorSequence(newRepeatedColorSequence);
  }, [colorSequence, length, height]);

  const rows = [];
  for (let i = 0; i < height; i++) {
    const startIndex = i * length;
    const endIndex = (i + 1) * length;
    let rowColors = repeatedColorSequence.slice(startIndex, endIndex);

    if (stitchPattern === 'back-and-forth' && i % 2 === 1) {
      rowColors = [...rowColors].reverse();
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

  return <GraphContainer>{rows}</GraphContainer>;
};

export default Graph;
