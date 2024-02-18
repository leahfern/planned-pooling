import React from 'react';

const Pixel = (props) => {
  const { color, showLeftBorder, showGridlines } = props;
  const borderRight = showGridlines ? '1px solid black' : 0;
  const borderLeft = showGridlines && showLeftBorder ? '1px solid black' : 0;
  const pixelStyling = {
    flexGrow: 1,
    background: color,
    borderRight: borderRight,
    borderLeft: borderLeft,
  };
  return <div style={pixelStyling} className="pixel"></div>;
};

export default Pixel;
