import React, { useState } from 'react';
import ColorInput from './ColorInput';
import getColorDetails from '../api/colorDetails.js';

const ColorItem = (props) => {
  const {
    colorItem,
    updateColorItem,
    colorSequence,
    setColorSequence,
    onDragStart,
    onDragOver,
    onDragEnter,
    onDragEnd,
  } = props;

  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = async (newColor) => {
    const colorDetails = await getColorDetails(newColor);
    updateColorItem({ ...colorItem, ...colorDetails });
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
  return (
    <div
      draggable={!showPicker}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      style={{
        background: colorItem.hex,
        color: colorItem.textColor,
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
      <ColorInput
        colorItem={colorItem}
        onColorChange={handleColorChange}
        onCountChange={handleCountChange}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
      />
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
