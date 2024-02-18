import React, { useState, useRef, useEffect } from 'react';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ color, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(color);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleColorChange = (newColor) => {
    // Convert the RGB color object to the format rgb(r, g, b)
    const rgbColorString = `rgb(${newColor.rgb.r}, ${newColor.rgb.g}, ${newColor.rgb.b})`;

    // Set the selected color using the RGB color string
    setSelectedColor(rgbColorString);

    // Pass the RGB color string to the onChange function
    onChange(rgbColorString);
  };

  const handleClosePicker = () => {
    setShowPicker(false);
  };

  return (
    <div style={{ position: 'relative' }} ref={pickerRef}>
      <span
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={() => setShowPicker(!showPicker)} // Toggle the visibility of the color picker
      >
        Edit
      </span>
      {showPicker && (
        <div
          style={{
            position: 'absolute',
            zIndex: '2',
            top: 0,
            right: '50%',
          }}
        >
          <ChromePicker color={selectedColor} onChange={handleColorChange} />
          <button
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              cursor: 'pointer',
              background: 'white',
              border: 'none',
              outline: '1px solid rgba(0,0,0,0.2)',
              borderRadius: 50,
              boxShadow: '4px 4px 5px rgba(0,0,0,0.2',
            }}
            onClick={handleClosePicker}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
