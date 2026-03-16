import React from 'react';

interface PixelProps {
  color?: string;
  showLeftBorder?: boolean;
  showTopBorder?: boolean;
  showGridlines?: boolean;
  cellSize?: number;
}

const Pixel: React.FC<PixelProps> = ({
  color,
  showLeftBorder,
  showTopBorder,
  showGridlines,
  cellSize = 12,
}) => {
  const borderStyle = '1px solid black';
  const borderRight = showGridlines ? borderStyle : 0;
  const borderLeft = showGridlines && showLeftBorder ? borderStyle : 0;
  const borderTop = showGridlines && showTopBorder ? borderStyle : 0;
  const borderBottom = showGridlines ? borderStyle : 0;
  const pixelStyling: React.CSSProperties = {
    flex: '0 0 auto',
    width: cellSize,
    height: cellSize,
    background: color || '#e0e0e0',
    borderRight,
    borderLeft,
    borderTop,
    borderBottom,
  };
  return <div style={pixelStyling} className="pixel" />;
};

export default Pixel;
