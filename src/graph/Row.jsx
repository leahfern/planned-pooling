import React from 'react';
import Pixel from './Pixel';

const Row = (props) => {
  const { width, colors, showGridlines, showTopBorder } = props;
  const borderStyling = '1px solid black';
  const pixels = [];
  for (let i = 0; i < width; i++) {
    //only have left border on first column
    const firstColumn = i === 0;
    pixels.push(
      <Pixel
        color={colors[i]}
        showLeftBorder={firstColumn}
        showGridlines={showGridlines}
        key={i}
      />
    );
  }
  const rowHeight = 500 / width;
  const borderBottom = showGridlines ? borderStyling : 0;
  const borderTop = showGridlines && showTopBorder ? borderStyling : 0;

  const rowStyling = {
    display: 'flex',
    width: '100%',
    height: rowHeight,
    borderBottom: borderBottom,
    borderTop: borderTop,
  };

  return (
    <div className="row" style={rowStyling}>
      {pixels}
    </div>
  );
};

export default Row;
