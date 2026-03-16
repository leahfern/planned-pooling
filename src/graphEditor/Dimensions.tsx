import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const DimensionsContainer = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  text-align: center;
  font-family: ${(props) => props.theme.fonts.secondary};
  font-size: ${(props) => props.theme.fontSizes.xlarge};
  font-weight: 700;
  letter-spacing: 0.02em;
  color: inherit;
  margin: 0 0 ${(props) => props.theme.spacing.medium} 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const InputPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.medium};
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.small};
`;

const Label = styled.span`
  font-size: ${(props) => props.theme.fontSizes.small};
  font-weight: 600;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.95);
`;

const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.small};
`;

const StepGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const QuickStepBtn = styled.button`
  font-size: ${(props) => props.theme.fontSizes.small};
  font-weight: 600;
  padding: 6px 10px;
  min-width: 36px;
  border: none;
  border-radius: 20px;
  background: ${(props) => props.theme.colors.surface || props.theme.colors.white};
  color: ${(props) => props.theme.colors.primary} !important;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
    filter: none;
  }
`;

const Input = styled.input`
  font-size: ${(props) => props.theme.fontSizes.medium};
  padding: ${(props) => props.theme.spacing.small};
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  width: 72px;
  text-align: center;
  box-sizing: border-box;
  transition: box-shadow 0.2s ease;
`;

const STEPS_LEFT = [-10, -5, -1];
const STEPS_RIGHT = [1, 5, 10];

interface DimensionsProps {
  width: number;
  height: number;
  setGraphLength: (n: number) => void;
  setGraphHeight: (n: number) => void;
  maxDimension?: number;
}

const Dimensions: React.FC<DimensionsProps> = ({
  width,
  height,
  setGraphLength,
  setGraphHeight,
  maxDimension = 500,
}) => {
  const [widthInput, setWidthInput] = useState(String(width));
  const [heightInput, setHeightInput] = useState(String(height));

  useEffect(() => {
    setWidthInput(String(width));
  }, [width]);
  useEffect(() => {
    setHeightInput(String(height));
  }, [height]);

  const commitWidth = () => {
    const n = parseInt(widthInput, 10);
    setGraphLength(Number.isNaN(n) ? width : n);
  };
  const commitHeight = () => {
    const n = parseInt(heightInput, 10);
    setGraphHeight(Number.isNaN(n) ? height : n);
  };

  const adjustBy = (
    setter: (n: number) => void,
    current: number,
    delta: number,
    syncInput: (s: string) => void
  ) => {
    const n = parseInt(String(current), 10);
    const base = Number.isNaN(n) ? 1 : n;
    const next = Math.min(maxDimension, Math.max(1, base + delta));
    setter(next);
    syncInput(String(next));
  };

  const renderStepButtons = (
    steps: number[],
    setter: (n: number) => void,
    current: number,
    syncInput: (s: string) => void,
    label: string
  ) =>
    steps.map((step) => (
      <QuickStepBtn
        key={step}
        type="button"
        onClick={() => adjustBy(setter, current, step, syncInput)}
        aria-label={
          step > 0
            ? `Add ${step} ${label}${step !== 1 ? 's' : ''}`
            : `Remove ${-step} ${label}${step !== -1 ? 's' : ''}`
        }
      >
        {step > 0 ? `+${step}` : step}
      </QuickStepBtn>
    ));

  return (
    <DimensionsContainer>
      <Title>Planned Pooling Helper</Title>
      <InputPanel>
        <InputContainer>
          <Label as="label" htmlFor="columns">Columns</Label>
          <FieldRow>
            <StepGroup>
              {renderStepButtons(STEPS_LEFT, setGraphLength, width, setWidthInput, 'column')}
            </StepGroup>
            <Input
              id="columns"
              type="number"
              value={widthInput}
              onChange={(e) => setWidthInput(e.target.value)}
              onBlur={commitWidth}
              onKeyDown={(e) => e.key === 'Enter' && commitWidth()}
              max={maxDimension}
              min={1}
              aria-label="Columns"
            />
            <StepGroup>
              {renderStepButtons(STEPS_RIGHT, setGraphLength, width, setWidthInput, 'column')}
            </StepGroup>
          </FieldRow>
        </InputContainer>
        <InputContainer>
          <Label as="label" htmlFor="rows">Rows</Label>
          <FieldRow>
            <StepGroup>
              {renderStepButtons(STEPS_LEFT, setGraphHeight, height, setHeightInput, 'row')}
            </StepGroup>
            <Input
              id="rows"
              type="number"
              value={heightInput}
              onChange={(e) => setHeightInput(e.target.value)}
              onBlur={commitHeight}
              onKeyDown={(e) => e.key === 'Enter' && commitHeight()}
              max={maxDimension}
              min={1}
              aria-label="Rows"
            />
            <StepGroup>
              {renderStepButtons(STEPS_RIGHT, setGraphHeight, height, setHeightInput, 'row')}
            </StepGroup>
          </FieldRow>
        </InputContainer>
      </InputPanel>
    </DimensionsContainer>
  );
};

export default Dimensions;
