import React, { useState } from 'react';
import ColorInput from './ColorInput';
import getColorDetails from '../api/colorDetails.js';
import { useDragHandlers } from '../hooks/useDragHandlers';
import { useDeleteHandler } from '../hooks/useDeleteHandler';

const ColorItem = (props) => {
  const { colorItem, updateColorItem, colorSequence, setColorSequence } = props;

  const [showPicker, setShowPicker] = useState(false);

  const updateColorWithDetails = async (newColor) => {
    const colorDetails = await getColorDetails(newColor);
    setShowPicker(false);
    updateColorItem({ ...colorItem, ...colorDetails });
  };

  const handleColorChange = (newColor) => {
    updateColorItem({ ...colorItem, hex: newColor });
  };

  const handleCountChange = (e) => {
    const inputValue = e.target.value;
    const newCount = inputValue ? parseInt(inputValue, 10) : 0; // Default to 0 if input is empty
    updateColorItem({ ...colorItem, count: newCount });
  };

  const handleDelete = useDeleteHandler({
    colorItem,
    colorSequence,
    setColorSequence,
  });
  const dragHandlers = useDragHandlers(props);

  return (
    <div
      draggable={!showPicker}
      onDragStart={dragHandlers.handleDragStart}
      onDragOver={dragHandlers.handleDragOver}
      onDragEnter={dragHandlers.handleDragEnter}
      onDragEnd={dragHandlers.handleDragEnd}
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
        updateColorWithDetails={updateColorWithDetails}
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
