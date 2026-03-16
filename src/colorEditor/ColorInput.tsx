import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ColorPicker from './ColorPicker';
import type { ColorSequenceItem } from '../types';

const MIN_STITCHES = 1;
const MAX_STITCHES = 100;

function clampStitches(
  value: string,
  current: number
): number {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return current;
  return Math.min(MAX_STITCHES, Math.max(MIN_STITCHES, n));
}

const ColorInputContainer = styled.div``;

const ColorName = styled.div`
  display: flex;
`;

const StitchesInputContainer = styled.div`
  margin-top: ${(props) => props.theme.spacing.large};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  font-size: ${(props) => props.theme.fontSizes.medium};
  padding: ${(props) => props.theme.spacing.small};
  border: 1px solid ${(props) => props.theme.colors.grey};
  border-radius: 4px;
  width: 70px;
  padding-right: ${(props) => props.theme.spacing.large};
  box-sizing: border-box;
`;

const StepButtonContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StepButton = styled.span`
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  font-family: 'Material Symbols Outlined';
  font-size: ${(props) => props.theme.fontSizes.medium};
  padding: 0 ${(props) => props.theme.spacing.small};
  user-select: none;
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

interface ColorInputProps {
  colorItem: ColorSequenceItem;
  onColorChange: (hex: string) => void;
  onCountChange: (e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }) => void;
  showPicker: boolean;
  setShowPicker: (v: boolean) => void;
  updateColorWithDetails: (newColor: string) => Promise<void>;
}

const ColorInput: React.FC<ColorInputProps> = ({
  colorItem,
  onColorChange,
  onCountChange,
  showPicker,
  setShowPicker,
  updateColorWithDetails,
}) => {
  const currentCount = Number(colorItem.count) || MIN_STITCHES;
  const [countInput, setCountInput] = useState(String(currentCount));

  useEffect(() => {
    setCountInput(String(currentCount));
  }, [currentCount]);

  const commitCount = () => {
    const next = clampStitches(countInput, currentCount);
    onCountChange({ target: { value: String(next) } });
  };

  const increment = () => {
    onCountChange({
      target: { value: String(clampStitches(String(currentCount + 1), currentCount)) },
    });
  };

  const decrement = () => {
    onCountChange({
      target: { value: String(clampStitches(String(currentCount - 1), currentCount)) },
    });
  };

  return (
    <ColorInputContainer>
      <ColorName>
        {colorItem.name ?? colorItem.hex}
        <ColorPicker
          color={colorItem.hex}
          onChange={onColorChange}
          updateColorWithDetails={updateColorWithDetails}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
        />
      </ColorName>
      <StitchesInputContainer>
        stitches:
        <InputWrapper>
          <Input
            value={countInput}
            onChange={(e) => setCountInput(e.target.value)}
            onBlur={commitCount}
            onKeyDown={(e) => e.key === 'Enter' && commitCount()}
            type="number"
            max={MAX_STITCHES}
            min={MIN_STITCHES}
          />
          <StepButtonContainer>
            <StepButton onClick={increment}>arrow_drop_up</StepButton>
            <StepButton onClick={decrement}>arrow_drop_down</StepButton>
          </StepButtonContainer>
        </InputWrapper>
      </StitchesInputContainer>
    </ColorInputContainer>
  );
};

export default ColorInput;
