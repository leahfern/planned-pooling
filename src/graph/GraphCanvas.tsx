import React, { useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import type { ColorSequenceItem } from '../types';
import { buildRepeatedColorSequence, getRowHexes } from '../utils/poolingGrid';

const BASE_CELL_PX = 12;

const CanvasWrapper = styled.div`
  display: inline-block;
  width: fit-content;
  line-height: 0;
`;

interface GraphCanvasProps {
  length: number;
  height: number;
  showGridlines?: boolean;
  colorSequence: ColorSequenceItem[];
  stitchPattern: string;
  zoom?: number;
  /** 0-based row index to highlight (e.g. row tracker). */
  highlightedRowIndex?: number | null;
}

export default function GraphCanvas({
  length,
  height,
  showGridlines,
  colorSequence,
  stitchPattern,
  zoom = 1,
  highlightedRowIndex = null,
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
      const rowColors = getRowHexes(row, length, repeatedSequence, stitchPattern);

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

      if (highlightedRowIndex !== null && highlightedRowIndex === row) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.35)';
        ctx.fillRect(0, row * cellPx, canvasWidth, cellPx);
        ctx.strokeStyle = 'rgba(218, 165, 32, 0.95)';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, row * cellPx + 1, canvasWidth - 2, cellPx - 2);
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
    highlightedRowIndex,
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
