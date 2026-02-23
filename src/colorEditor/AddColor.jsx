import React from 'react';
import styled from 'styled-components';
import { getRandomColor } from '../utils/colorUtils.js';
import getColorDetails from '../api/colorDetails.js';

const AddColorContainer = styled.div`
  margin-top: ${(props) => props.theme.spacing.large};
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

const AddColor = ({ colorSequence, setColorSequence }) => {
  const generateNewColor = async () => {
    const numStitches = Math.floor(Math.random() * 5) + 1;
    const randomColor = getRandomColor();
    const colorDetails = await getColorDetails(randomColor);
    return {
      sequence: colorSequence.length + 1,
      count: numStitches,
      ...colorDetails,
    };
  };

  const addColor = async (e) => {
    e.preventDefault();
    setColorSequence([...colorSequence, await generateNewColor()]);
  };

  return (
    <AddColorContainer>
      <AddColorButton onClick={addColor}>Add a color</AddColorButton>
    </AddColorContainer>
  );
};

export default AddColor;
