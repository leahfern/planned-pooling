import styled from 'styled-components';

const DimensionsContainer = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  text-align: center;
  font-family: ${(props) => props.theme.fonts.secondary};
  font-size: ${(props) => props.theme.fontSizes.xlarge};
  color: inherit;
  margin: 0 0 ${(props) => props.theme.spacing.small} 0;
`;

const InputPanel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.large};
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 88px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  font-size: ${(props) => props.theme.fontSizes.medium};
  padding: ${(props) => props.theme.spacing.small};
  border: 1px solid ${(props) => props.theme.colors.grey};
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  padding-right: ${(props) => props.theme.spacing.large};
`;

const Label = styled.span`
  font-size: ${(props) => props.theme.fontSizes.small};
  color: inherit;
  margin-top: ${(props) => props.theme.spacing.small};
`;

const StepButtonContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
`;

const StepButton = styled.span`
  color: ${(props) => props.theme.colors.text} !important;
  cursor: pointer;
  font-family: 'Material Symbols Outlined';
  font-size: ${(props) => props.theme.fontSizes.medium};
  padding: 0 ${(props) => props.theme.spacing.small};
  user-select: none;
  pointer-events: auto;
  &:hover {
    color: ${(props) => props.theme.colors.primary} !important;
  }
`;

const Dimensions = (props) => {
  const { width, height, setgraphLength, setGraphHeight, maxDimension = 500 } = props;

  const selectWidth = (e) => {
    setgraphLength(e.target.value);
  };
  const selectHeight = (e) => {
    setGraphHeight(e.target.value);
  };

  const increment = (setter, value) => {
    const n = parseInt(value, 10);
    const next = Number.isNaN(n) ? 1 : Math.min(maxDimension, n + 1);
    setter(next);
  };

  const decrement = (setter, value) => {
    const n = parseInt(value, 10);
    const next = Number.isNaN(n) ? 1 : Math.max(1, n - 1);
    setter(next);
  };

  return (
    <DimensionsContainer>
      <Title>Planned Pooling Helper</Title>
      <InputPanel>
        <InputContainer>
          <InputWrapper>
            <Input
              type="number"
              value={width}
              onChange={selectWidth}
              max={maxDimension}
              min={1}
            />
            <StepButtonContainer>
              <StepButton onClick={() => increment(setgraphLength, width)}>
                arrow_drop_up
              </StepButton>
              <StepButton onClick={() => decrement(setgraphLength, width)}>
                arrow_drop_down
              </StepButton>
            </StepButtonContainer>
          </InputWrapper>
          <Label>Columns</Label>
        </InputContainer>
        <InputContainer>
          <InputWrapper>
            <Input
              type="number"
              value={height}
              onChange={selectHeight}
              max={maxDimension}
              min={1}
            />
            <StepButtonContainer>
              <StepButton onClick={() => increment(setGraphHeight, height)}>
                arrow_drop_up
              </StepButton>
              <StepButton onClick={() => decrement(setGraphHeight, height)}>
                arrow_drop_down
              </StepButton>
            </StepButtonContainer>
          </InputWrapper>
          <Label>Rows</Label>
        </InputContainer>
      </InputPanel>
    </DimensionsContainer>
  );
};

export default Dimensions;
