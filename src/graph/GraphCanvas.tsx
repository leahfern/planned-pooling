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

  // Integer cell size avoids sub-pixel gaps between fillRects at fractional zooms.
  const cellPx = Math.max(1, Math.round(BASE_CELL_PX * zoom));
  const gridPixelWidth = length * cellPx;
  const gridPixelHeight = height * cellPx;

  const resolvedHighlightRow =
    highlightedRowIndex !== null &&
    highlightedRowIndex >= 0 &&
    highlightedRowIndex < height
      ? highlightedRowIndex
      : null;

  const highlightBarW =
    resolvedHighlightRow !== null
      ? Math.max(4, Math.min(10, Math.round(cellPx * 0.34)))
      : 0;
  const leftGutter = resolvedHighlightRow !== null ? highlightBarW : 0;
  const canvasWidth = leftGutter + gridPixelWidth;
  const canvasHeight = gridPixelHeight;

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
        const x = leftGutter + col * cellPx;
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

    if (resolvedHighlightRow !== null) {
      const y = resolvedHighlightRow * cellPx;
      const bandH = Math.max(2, Math.min(5, Math.round(cellPx * 0.22)));
      ctx.fillStyle = '#0f766e';
      ctx.fillRect(0, y, highlightBarW, cellPx);
      ctx.fillStyle = '#042f2e';
      ctx.fillRect(0, y, canvasWidth, bandH);
      ctx.fillRect(0, y + cellPx - bandH, canvasWidth, bandH);
    }
  }, [
    length,
    height,
    showGridlines,
    stitchPattern,
    zoom,
    cellPx,
    leftGutter,
    canvasWidth,
    canvasHeight,
    repeatedSequence,
    resolvedHighlightRow,
    highlightBarW,
  ]);

  return (
    <CanvasWrapper style={{ width: canvasWidth, height: canvasHeight }}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ display: 'block', width: canvasWidth, height: canvasHeight }}
        aria-label="Pattern grid preview"
      />
    </CanvasWrapper>
  );
}
