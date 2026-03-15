import React, { useState } from 'react';
import styled from 'styled-components';
import ColorInput from './ColorInput';
import getColorDetails from '../api/colorDetails.js';

const ItemContainer = styled.div`
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  padding: ${(props) => props.theme.spacing.small};
  border: 1px solid ${(props) => props.theme.colors.grey};
  display: flex;
  align-items: center;
  position: relative;
  cursor: grab;
  justify-content: space-between;
`;

const Sequence = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  padding: ${(props) => props.theme.spacing.medium};
`;

const DeleteButton = styled.div`
  align-self: start;
  cursor: pointer;
  font-family: 'Material Symbols Outlined';
  font-size: ${(props) => props.theme.fontSizes.medium};
  color: inherit;
  &:hover {
    filter: brightness(1.1);
  }
`;

const ColorItem = (props) => {
  const { colorItem, updateColorItem, colorSequence, setColorSequence, showToast } = props;

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
    const parsed = inputValue ? parseInt(inputValue, 10) : NaN;
    const newCount = Number.isNaN(parsed)
      ? colorItem.count
      : Math.min(100, Math.max(1, parsed));
    updateColorItem({ ...colorItem, count: newCount });
  };

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to remove this color?')) return;
    const newSequence = colorSequence
      .filter((color) => color.sequence !== colorItem.sequence)
      .map((item, index) => ({ ...item, sequence: index + 1 }));
    setColorSequence(newSequence);
    showToast?.('Color removed');
  };

  return (
    <ItemContainer background={colorItem.hex} color={colorItem.textColor}>
      <Sequence>{colorItem.sequence}</Sequence>
      <ColorInput
        colorItem={colorItem}
        onColorChange={handleColorChange}
        onCountChange={handleCountChange}
        updateColorWithDetails={updateColorWithDetails}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
      />
      <DeleteButton onClick={handleDelete} aria-label="Remove color">
        delete
      </DeleteButton>
    </ItemContainer>
  );
};

export default ColorItem;
