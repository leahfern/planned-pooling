import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import { theme } from './theme';
import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import GraphCanvas from './graph/GraphCanvas.jsx';
import GraphWrapper from './graph/GraphWrapper.jsx';
import GraphEditor from './graphEditor/GraphEditor.jsx';
import SidePanel from './colorEditor/SidePanel.jsx';
import Instructions from './Instructions.jsx';
import { ShareButton } from './ShareButton';
import SavedProjects from './SavedProjects.jsx';
import ProjectDetails from './ProjectDetails.jsx';
import { BACK_AND_FORTH } from './modules/stitchPatterns';
import useUrlParams from './hooks/useUrlParams';
import { getExportFileName } from './hooks/useSavedProjects';
import { exportGraphAsImage } from './utils/exportGraphAsImage';
import { exportGraphAsPdf } from './utils/exportGraphAsPdf';
import { MIN_GRID_DIMENSION, MAX_GRID_DIMENSION } from './constants/grid';

const SIDEBAR_TAB_WIDTH = 56;

function clampDimension(value, current) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return current;
  return Math.min(MAX_GRID_DIMENSION, Math.max(MIN_GRID_DIMENSION, n));
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-right: calc(${SIDEBAR_TAB_WIDTH}px);
  box-sizing: border-box;
`;

const TopBar = styled.div`
  width: 100%;
  flex-shrink: 0;
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  padding: ${(props) => props.theme.spacing.medium}
    ${(props) => props.theme.spacing.large};
  box-sizing: border-box;

  button {
    color: inherit;
  }
  label,
  span[class],
  .editor-label {
    color: rgba(255, 255, 255, 0.95);
  }
  input[type='number'] {
    background: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.text};
  }
  select {
    background: ${(props) => props.theme.colors.white} !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23008080' d='M6 8L1 3h10z'/%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important;
    background-position: right 12px center !important;
    padding-right: 32px !important;
    color: ${(props) => props.theme.colors.primary} !important;
  }
`;

const ContentRow = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
`;

const MainContent = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex: 1;
  min-width: 300px;
  padding: ${(props) => props.theme.spacing.large};
`;

const defaultParams = {
  graphLength: 41,
  graphHeight: 41,
  showGridlines: true,
  stitchPattern: BACK_AND_FORTH,
  colorSequence: [
    {
      sequence: 1,
      hex: '#ff0505',
      count: 3,
      textColor: 'black',
      name: 'Stoplight',
    },
    {
      sequence: 2,
      hex: '#000000',
      count: 7,
      textColor: 'white',
      name: 'Black',
    },
    {
      sequence: 3,
      hex: '#2a1dde',
      count: 3,
      textColor: 'white',
      name: 'Blue Angel',
    },
    {
      sequence: 4,
      hex: '#ffffff',
      count: 1,
      textColor: 'black',
      name: 'White',
    },
  ],
  showSidePanel: true,
  zoom: 1,
  hookNeedleSize: '',
  hookNeedleSizeOther: '',
  stitchType: '',
  stitchTypeOther: '',
  lotNumber: '',
  notes: '',
  yarnBrand: '',
  yarnName: '',
  yarnColorway: '',
};

function App() {
  const location = useLocation();
  const [params, setParams] = useUrlParams(defaultParams);
  const [currentProject, setCurrentProject] = useState(null);
  const graphRef = useRef(null);
  const shareUrl =
    typeof window !== 'undefined'
      ? window.location.origin + location.pathname + location.search
      : '';

  const {
    graphLength,
    graphHeight,
    showGridlines,
    stitchPattern,
    colorSequence,
    showSidePanel,
    zoom,
  } = params;

  const safeLength = clampDimension(graphLength, defaultParams.graphLength);
  const safeHeight = clampDimension(graphHeight, defaultParams.graphHeight);

  const setGraphHeight = (value) =>
    setParams({ ...params, graphHeight: clampDimension(value, graphHeight) });
  const setgraphLength = (value) =>
    setParams({ ...params, graphLength: clampDimension(value, graphLength) });
  const setShowGridlines = (value) =>
    setParams({ ...params, showGridlines: value });
  const setStitchPattern = (value) =>
    setParams({ ...params, stitchPattern: value });
  const setShowSidePanel = (value) =>
    setParams({ ...params, showSidePanel: value });
  const setColorSequence = (value) =>
    setParams({ ...params, colorSequence: value });

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <TopBar>
          <Instructions />
          <GraphEditor
            length={safeLength}
            height={safeHeight}
            setGraphHeight={setGraphHeight}
            setgraphLength={setgraphLength}
            maxDimension={MAX_GRID_DIMENSION}
            showGridlines={showGridlines}
            setShowGridlines={setShowGridlines}
            stitchPattern={stitchPattern}
            setStitchPattern={setStitchPattern}
            zoom={zoom}
            setParams={setParams}
            params={params}
          />
        </TopBar>
        <ProjectDetails currentProject={currentProject} params={params} />
        <ContentRow>
          <MainContent>
            <div ref={graphRef} style={{ maxWidth: '100%', overflow: 'auto' }}>
              <GraphWrapper
                graphLength={safeLength}
                graphHeight={safeHeight}
                setgraphLength={setgraphLength}
                setGraphHeight={setGraphHeight}
              >
                <GraphCanvas
                  length={safeLength}
                  height={safeHeight}
                  showGridlines={showGridlines}
                  colorSequence={colorSequence}
                  stitchPattern={stitchPattern}
                  zoom={zoom}
                />
              </GraphWrapper>
            </div>
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                marginTop: 20,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ShareButton />
              <button
                type="button"
                onClick={() =>
                  exportGraphAsImage(
                    graphRef.current,
                    getExportFileName(currentProject?.name, 'png'),
                  )
                }
              >
                Export image
              </button>
              <button
                type="button"
                onClick={() =>
                  exportGraphAsPdf({
                    graphNode: graphRef.current,
                    filename: getExportFileName(currentProject?.name, 'pdf'),
                    params,
                    projectTitle: currentProject?.name,
                    projectAuthor: currentProject?.author,
                    shareUrl,
                  })
                }
              >
                Export PDF
              </button>
              <SavedProjects
                params={params}
                setParams={setParams}
                defaultParams={defaultParams}
                currentProject={currentProject}
                setCurrentProject={setCurrentProject}
              />
            </div>
          </MainContent>
        </ContentRow>
        <SidePanel
          showSidePanel={showSidePanel}
          setShowSidePanel={setShowSidePanel}
          colorSequence={colorSequence}
          setColorSequence={setColorSequence}
          params={params}
          setParams={setParams}
        />
      </AppContainer>
    </ThemeProvider>
  );
}
export default App;
