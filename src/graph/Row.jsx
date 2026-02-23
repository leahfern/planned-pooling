import React from 'react';
import Pixel from './Pixel';

const BASE_CELL_PX = 12;

const Row = (props) => {
  const { length, colors, showGridlines, showTopBorder, zoom = 1 } = props;
  const cellPx = BASE_CELL_PX * zoom;
  const pixels = [];
  for (let i = 0; i < length; i++) {
    const firstColumn = i === 0;
    pixels.push(
      <Pixel
        color={colors[i]}
        showLeftBorder={firstColumn}
        showTopBorder={showTopBorder}
        showGridlines={showGridlines}
        cellSize={cellPx}
        key={i}
      />
    );
  }

  const rowStyling = {
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
