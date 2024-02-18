import './App.css';
import { useState } from 'react';
import Graph from './graph/Graph.jsx';
import GraphEditor from './graphEditor/GraphEditor.jsx';
import SidePanel from './colorEditor/SidePanel.jsx';

function App() {
  const [graphWidth, setGraphWidth] = useState(20);
  const [graphHeight, setGraphHeight] = useState(20);
  const [showGridlines, setShowGridlines] = useState(true);
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [colorSequence, setColorSequence] = useState([
    { sequence: 1, color: 'rgb(120,120,120)', count: 3 },
    { sequence: 2, color: 'rgb(255,120,120)', count: 2 },
    { sequence: 3, color: 'rgb(0,120,255)', count: 5 },
  ]);

  const mainContentStyling = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    minWidth: 300,
    height: '100%',
  };
  const appStyling = {
    display: 'flex',
  };
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
        />
        <Graph
          width={graphWidth}
          height={graphHeight}
          showGridlines={showGridlines}
          colorSequence={colorSequence}
        />
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
