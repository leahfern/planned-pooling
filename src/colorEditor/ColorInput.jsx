import React from 'react';
import styled from 'styled-components';
import ColorPicker from './ColorPicker';

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

const ColorInput = ({
  colorItem,
  onColorChange,
  onCountChange,
  showPicker,
  setShowPicker,
  updateColorWithDetails,
}) => {
  const increment = () => {
    onCountChange({ target: { value: parseInt(colorItem.count) + 1 } });
  };

  const decrement = () => {
    onCountChange({ target: { value: parseInt(colorItem.count) - 1 } });
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
            value={colorItem.count}
            onChange={onCountChange}
            type="number"
            max={100}
            min={1}
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
