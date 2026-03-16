import React from 'react';
import Pixel from './Pixel';

const BASE_CELL_PX = 12;

interface RowProps {
  length: number;
  colors: string[];
  showGridlines?: boolean;
  showTopBorder?: boolean;
  zoom?: number;
}

const Row: React.FC<RowProps> = ({
  length,
  colors,
  showGridlines,
  showTopBorder,
  zoom = 1,
}) => {
  const cellPx = BASE_CELL_PX * zoom;
  const pixels = [];
  for (let i = 0; i < length; i++) {
    const firstColumn = i === 0;
    pixels.push(
      <Pixel
        key={i}
        color={colors[i]}
        showLeftBorder={firstColumn}
        showTopBorder={showTopBorder}
        showGridlines={showGridlines}
        cellSize={cellPx}
      />
    );
  }

  const rowStyling: React.CSSProperties = {
    display: 'flex',
    width: length * cellPx,
    height: cellPx,
  };

  return (
    <div className="row" style={rowStyling}>
      {pixels}
    </div>
  );
};

export default Row;
