import React, { useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';

const BASE_CELL_PX = 12;

const CanvasWrapper = styled.div`
  display: inline-block;
  width: fit-content;
  line-height: 0;
`;

function buildRepeatedColorSequence(colorSequence, length, height) {
  const total = length * height;
  const result = [];
  while (result.length < total) {
    for (const colorInfo of colorSequence) {
      for (let c = 0; c < colorInfo.count; c++) {
        result.push(colorInfo.hex || '#e0e0e0');
      }
    }
  }
  return result.slice(0, total);
}

export default function GraphCanvas({
  length,
  height,
  showGridlines,
  colorSequence,
  stitchPattern,
  zoom = 1,
}) {
  const canvasRef = useRef(null);

  const cellPx = BASE_CELL_PX * zoom;
  const canvasWidth = length * cellPx;
  const canvasHeight = height * cellPx;

  const repeatedSequence = useMemo(
    () => buildRepeatedColorSequence(colorSequence, length, height),
    [colorSequence, length, height]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || repeatedSequence.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    for (let row = 0; row < height; row++) {
      const startIndex = row * length;
      let rowColors = repeatedSequence.slice(startIndex, startIndex + length);

      if (stitchPattern === 'back-and-forth' && row % 2 === 1) {
        rowColors = [...rowColors].reverse();
      }

      for (let col = 0; col < length; col++) {
        const x = col * cellPx;
        const y = row * cellPx;
        ctx.fillStyle = rowColors[col] || '#e0e0e0';
        ctx.fillRect(x, y, cellPx, cellPx);

        if (showGridlines) {
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellPx, cellPx);
        }
      }
    }
  }, [
    length,
    height,
    showGridlines,
    stitchPattern,
    zoom,
    canvasWidth,
    canvasHeight,
    repeatedSequence,
  ]);

  return (
    <CanvasWrapper style={{ width: canvasWidth, height: canvasHeight }}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ display: 'block', width: canvasWidth, height: canvasHeight }}
        aria-label="Planned pooling grid preview"
      />
    </CanvasWrapper>
  );
}
