import React from 'react';
import ColorPicker from './ColorPicker';

const ColorInput = ({ color, count, onColorChange, onCountChange }) => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        {color}
        <ColorPicker color={color} onChange={onColorChange} />
      </div>
      <div style={{ marginTop: 20 }}>
        stitches:
        <input
          defaultValue={count}
          onChange={onCountChange}
          type="number"
          max={100}
          min={1}
        />
      </div>
    </div>
  );
};

export default ColorInput;