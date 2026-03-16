import React, { useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import type { ColorSequenceItem } from '../types';

const BASE_CELL_PX = 12;

const CanvasWrapper = styled.div`
  display: inline-block;
  width: fit-content;
  line-height: 0;
`;

function buildRepeatedColorSequence(
  colorSequence: ColorSequenceItem[],
  length: number,
  height: number
): string[] {
  const total = length * height;
  const result: string[] = [];
  while (result.length < total) {
    for (const colorInfo of colorSequence) {
      for (let c = 0; c < colorInfo.count; c++) {
        result.push(colorInfo.hex || '#e0e0e0');
      }
    }
  }
  return result.slice(0, total);
}

interface GraphCanvasProps {
  length: number;
  height: number;
  showGridlines?: boolean;
  colorSequence: ColorSequenceItem[];
  stitchPattern: string;
  zoom?: number;
}

export default function GraphCanvas({
  length,
  height,
  showGridlines,
  colorSequence,
  stitchPattern,
  zoom = 1,
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    cellPx,
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
