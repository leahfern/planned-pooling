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
  overflow: hidden;
  margin-top: ${(props) => props.theme.spacing.small};
`;

/** Only the color list scrolls; keeps “Add a color” pinned above the drawer bottom. */
const ColorListScroll = styled.div`
  flex: 1 1 0;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const SidePanelFooter = styled.div`
  flex-shrink: 0;
  padding-top: ${(props) => props.theme.spacing.medium};
  border-top: 1px solid ${(props) => props.theme.colors.grey};
`;

const SavedYarnsBlock = styled.div`
  flex-shrink: 0;
`;

const Title = styled.h2`
  width: 100%;
  text-align: center;
  font-family: ${(props) => props.theme.fonts.secondary};
  font-size: ${(props) => props.theme.fontSizes.large};
  margin: 0 0 ${(props) => props.theme.spacing.small} 0;
  flex-shrink: 0;
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
          <SavedYarnsBlock>
            <SavedYarns params={params} setParams={setParams} showToast={showToast} />
          </SavedYarnsBlock>
          <ColorListScroll>
            <ColorList
              colorSequence={colorSequence}
              setColorSequence={setColorSequence}
              showToast={showToast}
            />
          </ColorListScroll>
          <SidePanelFooter>
            <AddColor
              colorSequence={colorSequence}
              setColorSequence={setColorSequence}
              showToast={showToast}
            />
          </SidePanelFooter>
        </SidePanelContent>
      </SidePanelContainer>
    </>
  );
};

export default SidePanel;
