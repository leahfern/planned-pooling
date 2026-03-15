import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import { lightTheme, darkTheme } from './theme';
import usePreferredColorScheme from './hooks/usePreferredColorScheme';
import { useState, useRef, useEffect, useCallback } from 'react';
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
import { Toast } from './Toast';

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
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.primaryDark || props.theme.colors.primary} 100%);
  color: ${(props) => props.theme.colors.white};
  padding: ${(props) => props.theme.spacing.large}
    ${(props) => props.theme.spacing.large};
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  button {
    color: inherit;
  }
  label,
  span[class],
  .editor-label {
    color: rgba(255, 255, 255, 0.95);
  }
  input[type='number'] {
    background: ${(props) => props.theme.colors.surface || props.theme.colors.white};
    color: ${(props) => props.theme.colors.text};
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }
  input[type='number']:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.accent};
  }
  select {
    background: ${(props) => props.theme.colors.surface || props.theme.colors.white} !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${(props) => encodeURIComponent(props.theme.colors.primary)}' d='M6 8L1 3h10z'/%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important;
    background-position: right 12px center !important;
    padding: 8px 32px 8px 12px !important;
    border-radius: 10px !important;
    border: 1px solid rgba(0,0,0,0.06) !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06) !important;
    color: ${(props) => props.theme.colors.text} !important;
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
      hex: '#008080',
      count: 3,
      textColor: 'white',
      name: 'Teal',
    },
    {
      sequence: 2,
      hex: '#C65D3B',
      count: 7,
      textColor: 'white',
      name: 'Terracotta',
    },
    {
      sequence: 3,
      hex: '#FFD700',
      count: 3,
      textColor: 'black',
      name: 'Gold',
    },
    {
      sequence: 4,
      hex: '#F5F5DC',
      count: 1,
      textColor: 'black',
      name: 'Cream',
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

const TOAST_DURATION_MS = 3000;

function App() {
  const colorScheme = usePreferredColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const location = useLocation();
  const [params, setParams] = useUrlParams(defaultParams);
  const [currentProject, setCurrentProject] = useState(null);
  const [toast, setToast] = useState(null);
  const graphRef = useRef(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, TOAST_DURATION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

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
  const setGraphLength = (value) =>
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
    <ThemeProvider theme={theme} key={colorScheme}>
      <GlobalStyle />
      {toast && <Toast message={toast.message} type={toast.type} />}
      <AppContainer>
        <TopBar>
          <Instructions />
          <GraphEditor
            length={safeLength}
            height={safeHeight}
            setGraphHeight={setGraphHeight}
            setGraphLength={setGraphLength}
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
                setGraphLength={setGraphLength}
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
              <ShareButton onCopySuccess={() => showToast('URL copied to clipboard')} onCopyError={() => showToast('Failed to copy URL', 'error')} />
              <button
                type="button"
                onClick={() =>
                  exportGraphAsImage(
                    graphRef.current,
                    getExportFileName(currentProject?.name, 'png'),
                    {
                      onSuccess: () => showToast('Image exported'),
                      onError: () => showToast('Failed to export image', 'error'),
                    },
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
                    onSuccess: () => showToast('PDF exported'),
                    onError: () => showToast('Failed to export PDF', 'error'),
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
                showToast={showToast}
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
          showToast={showToast}
        />
      </AppContainer>
    </ThemeProvider>
  );
}
export default App;
