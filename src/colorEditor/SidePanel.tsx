import React from 'react';
import styled from 'styled-components';
import ColorList from './ColorList';
import AddColor from './AddColor';
import SavedYarns from '../SavedYarns';
import type { AppParams, ColorSequenceItem } from '../types';

const DRAWER_WIDTH = 350;
const TAB_WIDTH = 56;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 998;
  animation: fadeIn 0.2s ease-out;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const SidePanelContainer = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${(props) => (props.$open ? `${DRAWER_WIDTH}px` : `${TAB_WIDTH}px`)};
  max-width: ${(props) =>
    props.$open ? `min(${DRAWER_WIDTH}px, calc(100vw - 24px))` : 'none'};
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.12);
  padding: ${(props) =>
    props.$open ? props.theme.spacing.medium : '12px 10px'};
  background: ${(props) => props.theme.colors.cardBg || props.theme.colors.white};
  transition: width 0.25s ease-in-out;
  z-index: 999;
  overflow: visible;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-shrink: 0;
`;

const SidePanelContent = styled.div<{ $open: boolean }>`
  display: ${(props) => (props.$open ? 'flex' : 'none')};
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-top: ${(props) => props.theme.spacing.small};
`;

const Title = styled.h2`
  width: 100%;
  text-align: center;
  font-family: ${(props) => props.theme.fonts.secondary};
  font-size: ${(props) => props.theme.fontSizes.large};
  margin: 0 0 ${(props) => props.theme.spacing.small} 0;
`;

interface SidePanelProps {
  colorSequence: ColorSequenceItem[];
  setColorSequence: (seq: ColorSequenceItem[]) => void;
  showSidePanel: boolean;
  setShowSidePanel: (v: boolean) => void;
  params: AppParams;
  setParams: (p: AppParams) => void;
  showToast?: (message: string) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  colorSequence,
  setColorSequence,
  showSidePanel,
  setShowSidePanel,
  params,
  setParams,
  showToast,
}) => {
  const openCloseIcon = showSidePanel ? 'chevron_right' : 'palette';

  return (
    <>
      {showSidePanel && (
        <Backdrop
          onClick={() => setShowSidePanel(false)}
          aria-hidden="true"
        />
      )}
      <SidePanelContainer $open={showSidePanel}>
        <ButtonContainer>
          <button
            type="button"
            onClick={() => setShowSidePanel(!showSidePanel)}
            className="material-symbols-outlined"
            style={{ width: 'fit-content' }}
            aria-label={showSidePanel ? 'Close color list' : 'Open color list'}
            aria-expanded={showSidePanel}
            data-testid="toggleSidePanelButton"
          >
            {openCloseIcon}
          </button>
        </ButtonContainer>
        <SidePanelContent $open={showSidePanel} data-testid="sidePanelContent">
          <Title>Color list</Title>
          <SavedYarns params={params} setParams={setParams} showToast={showToast} />
          <ColorList
            colorSequence={colorSequence}
            setColorSequence={setColorSequence}
            showToast={showToast}
          />
        </SidePanelContent>
        {showSidePanel && (
          <AddColor
            colorSequence={colorSequence}
            setColorSequence={setColorSequence}
            showToast={showToast}
          />
        )}
      </SidePanelContainer>
    </>
  );
};

export default SidePanel;
