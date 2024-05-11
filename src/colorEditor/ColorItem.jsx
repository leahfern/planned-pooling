import React, { useState } from 'react';
import ColorPicker from './ColorPicker';

const ColorItem = (props) => {
  const {
    colorItem,
    updateColorItem,
    textColor,
    colorSequence,
    setColorSequence,
    onDragStart,
    onDragOver,
    onDragEnter,
    onDragEnd,
  } = props;

  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = (newColor) => {
    updateColorItem({ ...colorItem, color: newColor });
  };

  const handleCountChange = (e) => {
    const inputValue = e.target.value;
    const newCount = inputValue ? parseInt(inputValue, 10) : 0; // Default to 0 if input is empty
    updateColorItem({ ...colorItem, count: newCount });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this color?'
    );
    if (shouldDelete) {
      const newSequence = colorSequence.filter(
        (color) => color.sequence !== colorItem.sequence
      );
      const reorderedSequence = newSequence.map((color) =>
        color.sequence > colorItem.sequence
          ? { ...color, sequence: color.sequence - 1 }
          : color
      );
      setColorSequence(reorderedSequence);
    }
  };

  const rgbToHex = (rgb) => {
    const [r, g, b] = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1);
    return (
      '#' + ((1 << 24) + (+r << 16) + (+g << 8) + +b).toString(16).slice(1)
    );
  };

  return (
    <div
      draggable={!showPicker}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      style={{
        background: colorItem.color,
        color: textColor, // Set text color dynamically
        padding: 5,
        border: '1px solid gray',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        cursor: 'grab',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          padding: 10,
        }}
      >
        {colorItem.sequence}
      </div>
      <div>
        <div style={{ display: 'flex' }}>
          {rgbToHex(colorItem.color)}
          <ColorPicker
            color={colorItem.color}
            onChange={handleColorChange}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          stitches:
          <input
            defaultValue={colorItem.count}
            onChange={handleCountChange}
            type="number"
            max={100}
            min={1}
          />
        </div>
      </div>
      <div
        style={{ alignSelf: 'start', cursor: 'pointer' }}
        onClick={handleDelete}
        className="material-symbols-outlined"
      >
        close
      </div>
    </div>
  );
};

export default ColorItem;
