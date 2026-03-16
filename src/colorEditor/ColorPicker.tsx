import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { ChromePicker, type ColorResult } from 'react-color';

const PickerContainer = styled.div`
  position: relative;
`;

const EditIcon = styled.span`
  cursor: pointer;
  margin-left: ${(props) => props.theme.spacing.small};
  font-family: 'Material Symbols Outlined';
`;

const Popup = styled.div`
  position: fixed;
  z-index: 1001;
  cursor: crosshair;
  background: ${(props) => props.theme.colors.cardBg || props.theme.colors.white};
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

interface ColorPickerProps {
  color: string;
  onChange: (hex: string) => void;
  showPicker: boolean;
  setShowPicker: (v: boolean) => void;
  updateColorWithDetails: (hex: string) => Promise<void>;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  showPicker,
  setShowPicker,
  updateColorWithDetails,
}) => {
  const [initialColor, setInitialColor] = useState(color);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleColorChange = (newColor: ColorResult) => {
    onChange(newColor.hex);
  };

  const handleOpen = () => {
    setInitialColor(color);
    setShowPicker(true);
  };

  useEffect(() => {
    if (!showPicker || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPosition({ top: rect.top, left: rect.left });
  }, [showPicker]);

  const handleSave = useCallback(() => {
    setShowPicker(false);
    updateColorWithDetails(color);
  }, [color, setShowPicker, updateColorWithDetails]);

  const handleCancel = useCallback(() => {
    setShowPicker(false);
    onChange(initialColor);
  }, [initialColor, onChange, setShowPicker]);

  useEffect(() => {
    if (!showPicker) return;
    popupRef.current?.focus();
  }, [showPicker]);

  useEffect(() => {
    if (!showPicker) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showPicker, handleCancel]);

  useEffect(() => {
    if (!showPicker) return;
    const onMouseDown = (e: MouseEvent) => {
      const popup = popupRef.current;
      const anchor = anchorRef.current;
      if (
        popup?.contains(e.target as Node) ||
        anchor?.contains(e.target as Node)
      )
        return;
      handleCancel();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [showPicker, handleCancel]);

  const popupContent = showPicker && (
    <Popup
      ref={popupRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Color picker — use Save to apply or Cancel to discard changes"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateX(-100%)',
        marginLeft: '-8px',
      }}
    >
      <PickerWrap className="app-color-picker-wrap">
        <ChromePicker color={color} onChange={handleColorChange} />
      </PickerWrap>
      <ButtonContainer>
        <Button type="button" onClick={handleSave}>Save</Button>
        <Button type="button" onClick={handleCancel}>Cancel</Button>
      </ButtonContainer>
    </Popup>
  );

  return (
    <PickerContainer ref={anchorRef}>
      <EditIcon onClick={handleOpen}>edit</EditIcon>
      {typeof document !== 'undefined' && popupContent
        ? createPortal(popupContent, document.body)
        : null}
    </PickerContainer>
  );
};

export default ColorPicker;
