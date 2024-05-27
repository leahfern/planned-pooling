import Dimensions from './Dimensions.jsx';
import { STITCH_PATTERNS } from '../modules/stitchPatterns';

const GraphEditor = (props) => {
  const {
    width,
    height,
    setGraphWidth,
    setGraphHeight,
    showGridlines,
    setShowGridlines,
    stitchPattern,
    setStitchPattern,
  } = props;

  const editorStyling = {
    width: '100%',
    marginBottom: 10,
  };

  const handleShowHideGridlines = (e) => {
    setShowGridlines(!showGridlines);
  };

  return (
    <div style={editorStyling}>
      <Dimensions
        width={width}
        height={height}
        setGraphHeight={setGraphHeight}
        setGraphWidth={setGraphWidth}
      />
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div>
          <input
            type="checkbox"
            checked={showGridlines}
            onChange={handleShowHideGridlines}
          />
          Show gridlines
        </div>
        <div style={{ marginLeft: 10 }}>
          <select
            value={stitchPattern}
            onChange={(e) => setStitchPattern(e.target.value)}
          >
            {STITCH_PATTERNS.map((pattern) => (
              <option key={pattern} value={pattern}>
                {`${pattern} stitching`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default GraphEditor;
