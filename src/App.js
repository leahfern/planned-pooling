import './App.css';
import Graph from './graph/Graph.jsx';
import GraphEditor from './graphEditor/GraphEditor.jsx';
import SidePanel from './colorEditor/SidePanel.jsx';
import { ShareButton } from './ShareButton';
import { BACK_AND_FORTH } from './modules/stitchPatterns';
import useUrlParams from './hooks/useUrlParams';

const mainContentStyling = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  width: '100%',
  minWidth: 300,
  height: '100%',
  padding: 30,
};
const appStyling = {
  display: 'flex',
};

const defaultParams = {
  graphWidth: 20,
  graphHeight: 20,
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
};

function App() {
  const [params, setParams] = useUrlParams(defaultParams);

  const {
    graphWidth,
    graphHeight,
    showGridlines,
    stitchPattern,
    colorSequence,
    showSidePanel,
  } = params;

  const setGraphHeight = (value) =>
    setParams({ ...params, graphHeight: value });
  const setGraphWidth = (value) => setParams({ ...params, graphWidth: value });
  const setShowGridlines = (value) =>
    setParams({ ...params, showGridlines: value });
  const setStitchPattern = (value) =>
    setParams({ ...params, stitchPattern: value });
  const setShowSidePanel = (value) =>
    setParams({ ...params, showSidePanel: value });
  const setColorSequence = (value) =>
    setParams({ ...params, colorSequence: value });

  return (
    <div className="App" style={appStyling}>
      <div className="mainContent" style={mainContentStyling}>
        <GraphEditor
          width={graphWidth}
          height={graphHeight}
          setGraphHeight={setGraphHeight}
          setGraphWidth={setGraphWidth}
          showGridlines={showGridlines}
          setShowGridlines={setShowGridlines}
          stitchPattern={stitchPattern}
          setStitchPattern={setStitchPattern}
        />
        <Graph
          width={graphWidth}
          height={graphHeight}
          showGridlines={showGridlines}
          colorSequence={colorSequence}
          stitchPattern={stitchPattern}
        />
        <div style={{ width: '100%', textAlign: 'center', marginTop: 20 }}>
          <ShareButton />
        </div>
      </div>
      <SidePanel
        showSidePanel={showSidePanel}
        setShowSidePanel={setShowSidePanel}
        colorSequence={colorSequence}
        setColorSequence={setColorSequence}
      />
    </div>
  );
}
export default App;
