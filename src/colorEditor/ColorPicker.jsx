import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ChromePicker } from 'react-color';

const PickerContainer = styled.div`
  position: relative;
`;

const EditIcon = styled.span`
  cursor: pointer;
  margin-left: ${(props) => props.theme.spacing.small};
  font-family: 'Material Symbols Outlined';
`;

const Popup = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  right: 50%;
  cursor: crosshair;
  background: ${(props) => props.theme.colors.white};
  padding: ${(props) => props.theme.spacing.small};
  border-radius: ${(props) => props.theme.borderRadius?.button || '8px'};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid ${(props) => props.theme.colors.grey};
  outline: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.small};
  margin-top: 6px;
  padding-top: 6px;
`;

const PickerWrap = styled.div``;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: ${(props) => props.theme.borderRadius?.button || '8px'};
  padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.medium};
  font-size: ${(props) => props.theme.fontSizes.small};
  cursor: pointer;
  transition: filter 0.2s ease-in-out;

  &:hover {
    filter: brightness(1.1);
  }
`;

const ColorPicker = ({
  color,
  onChange,
  showPicker,
  setShowPicker,
  updateColorWithDetails,
}) => {
  const [initialColor, setInitialColor] = useState(color);
  const popupRef = useRef(null);

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

  useEffect(() => {
    if (!showPicker) return;
    popupRef.current?.focus();
  }, [showPicker]);

  useEffect(() => {
    if (!showPicker) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showPicker]);

  return (
    <PickerContainer>
      <EditIcon onClick={handleOpen}>edit</EditIcon>
      {showPicker && (
        <Popup
          ref={popupRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Color picker — use Save to apply or Cancel to discard changes"
        >
          <PickerWrap className="app-color-picker-wrap">
            <ChromePicker color={color} onChange={handleColorChange} />
          </PickerWrap>
          <ButtonContainer>
            <Button type="button" onClick={handleSave}>Save</Button>
            <Button type="button" onClick={handleCancel}>Cancel</Button>
          </ButtonContainer>
        </Popup>
      )}
    </PickerContainer>
  );
};

export default ColorPicker;
