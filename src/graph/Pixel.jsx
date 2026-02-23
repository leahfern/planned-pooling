import React from 'react';

const Pixel = (props) => {
  const { color, showLeftBorder, showTopBorder, showGridlines, cellSize = 12 } = props;
  const borderStyle = '1px solid black';
  const borderRight = showGridlines ? borderStyle : 0;
  const borderLeft = showGridlines && showLeftBorder ? borderStyle : 0;
  const borderTop = showGridlines && showTopBorder ? borderStyle : 0;
  const borderBottom = showGridlines ? borderStyle : 0;
  const pixelStyling = {
    flex: '0 0 auto',
    width: cellSize,
    height: cellSize,
    background: color || '#e0e0e0',
    borderRight,
    borderLeft,
    borderTop,
    borderBottom,
  };
  return <div style={pixelStyling} className="pixel"></div>;
};

export default Pixel;
