import React from 'react';
import styled from 'styled-components';
import { getRandomColor } from '../utils/colorUtils';
import getColorDetails from '../api/colorDetails';
import type { ColorSequenceItem } from '../types';

const AddColorContainer = styled.div`
  margin-top: ${(props) => props.theme.spacing.medium};
  flex-shrink: 0;
  display: flex;
  justify-content: center;
`;

const AddColorButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  border: none;
  padding: ${(props) => props.theme.spacing.medium};
  font-size: ${(props) => props.theme.fontSizes.medium};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.colors.accent};
  }
`;

interface AddColorProps {
  colorSequence: ColorSequenceItem[];
  setColorSequence: (seq: ColorSequenceItem[]) => void;
  showToast?: (message: string) => void;
}

const AddColor: React.FC<AddColorProps> = ({
  colorSequence,
  setColorSequence,
  showToast,
}) => {
  const generateNewColor = async (): Promise<ColorSequenceItem> => {
    const numStitches = Math.floor(Math.random() * 5) + 1;
    const randomColor = getRandomColor();
    const colorDetails = await getColorDetails(randomColor);
    return {
      sequence: colorSequence.length + 1,
      count: numStitches,
      ...colorDetails,
    };
  };

  const addColor = async (e: React.MouseEvent) => {
    e.preventDefault();
    setColorSequence([...colorSequence, await generateNewColor()]);
    showToast?.('Color added');
  };

  return (
    <AddColorContainer>
      <AddColorButton onClick={addColor}>Add a color</AddColorButton>
    </AddColorContainer>
  );
};

export default AddColor;
