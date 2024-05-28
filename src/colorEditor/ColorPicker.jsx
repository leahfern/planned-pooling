import React, { useState, useRef } from 'react';
import { ChromePicker } from 'react-color';
import '../App.css';

const ColorPicker = ({
  color,
  onChange,
  showPicker,
  setShowPicker,
  updateColorWithDetails,
}) => {
  const [initialColor, setInitialColor] = useState(color);
  const pickerRef = useRef(null);

  const handleColorChange = (newColor) => {
    onChange(newColor.hex);
  };

  const handleOpen = () => {
    setInitialColor(color);
    setShowPicker(true);
  };

  const handleSave = () => {
    setShowPicker(false);
    updateColorWithDetails(color);
  };

  const handleCancel = () => {
    setShowPicker(false);
    onChange(initialColor);
  };

  return (
    <div className="color-picker" ref={pickerRef}>
      <span className="color-picker-edit" onClick={handleOpen}>
        <i className="material-symbols-outlined">edit</i>
      </span>
      {showPicker && (
        <div className="color-picker-popup">
          <ChromePicker color={color} onChange={handleColorChange} />
          <div className="color-picker-buttons">
            <button className="color-picker-save" onClick={handleSave}>
              Save
            </button>
            <button className="color-picker-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
