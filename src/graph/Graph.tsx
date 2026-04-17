import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Row from './Row';
import type { ColorSequenceItem } from '../types';
import { buildRepeatedColorSequence, getRowHexes } from '../utils/poolingGrid';

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
    setRepeatedColorSequence(
      buildRepeatedColorSequence(colorSequence, length, height)
    );
  }, [colorSequence, length, height]);

  const rows = [];
  for (let i = 0; i < height; i++) {
    const rowColors = getRowHexes(i, length, repeatedColorSequence, stitchPattern);

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
