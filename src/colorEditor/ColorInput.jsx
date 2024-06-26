import React from 'react';
import ColorPicker from './ColorPicker';

const ColorInput = ({
  colorItem,
  onColorChange,
  onCountChange,
  showPicker,
  setShowPicker,
  updateColorWithDetails,
}) => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        {colorItem.name ?? colorItem.hex}
        <ColorPicker
          color={colorItem.hex}
          onChange={onColorChange}
          updateColorWithDetails={updateColorWithDetails}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
        />
      </div>
      <div style={{ marginTop: 20 }}>
        stitches:
        <input
          value={colorItem.count}
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
