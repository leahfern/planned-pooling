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

const Drawer = styled.div<{ $open: boolean }>`
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

const ToggleRow = styled.div`
  display: flex;
  flex-shrink: 0;
`;

/**
 * Vertical stack inside the drawer: fixed header sections at the top, a
 * content-sized (but scrollable when tall) color list in the middle, and a
 * fixed "Add a color" footer sitting directly below the list.
 *
 * Key behavior:
 * - Short list: the list takes its natural height and the Add button sits
 *   immediately under it; empty space falls below the button.
 * - Long list: the list shrinks to fit remaining space and scrolls internally,
 *   so the Add button stays pinned above the drawer bottom.
 */
const DrawerBody = styled.div<{ $open: boolean }>`
  display: ${(props) => (props.$open ? 'flex' : 'none')};
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  margin-top: ${(props) => props.theme.spacing.small};
`;

const Header = styled.div`
  flex-shrink: 0;
`;

const Title = styled.h2`
  width: 100%;
  text-align: center;
  font-family: ${(props) => props.theme.fonts.secondary};
  font-size: ${(props) => props.theme.fontSizes.large};
  margin: 0 0 ${(props) => props.theme.spacing.small} 0;
`;

/**
 * Content-sized by default, shrinks and scrolls only when the children would
 * overflow the space left over by the fixed header and footer.
 *
 * - flex-grow: 0  -> do not expand to fill remaining space (keeps the footer
 *   glued to the bottom of the list when short)
 * - flex-shrink: 1 -> can give up space when the list is tall
 * - flex-basis: auto -> start at the content's natural height
 * - min-height: 0 -> allow shrinking below intrinsic content size for scroll
 */
const ColorListScroll = styled.div`
  flex: 0 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Footer = styled.div`
  flex-shrink: 0;
  padding-top: ${(props) => props.theme.spacing.medium};
  border-top: 1px solid ${(props) => props.theme.colors.grey};
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
      <Drawer $open={showSidePanel}>
        <ToggleRow>
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
        </ToggleRow>

        <DrawerBody $open={showSidePanel} data-testid="sidePanelContent">
          <Header>
            <Title>Color list</Title>
            <SavedYarns
              params={params}
              setParams={setParams}
              showToast={showToast}
            />
          </Header>

          <ColorListScroll>
            <ColorList
              colorSequence={colorSequence}
              setColorSequence={setColorSequence}
              showToast={showToast}
            />
          </ColorListScroll>

          <Footer>
            <AddColor
              colorSequence={colorSequence}
              setColorSequence={setColorSequence}
              showToast={showToast}
            />
          </Footer>
        </DrawerBody>
      </Drawer>
    </>
  );
};

export default SidePanel;
