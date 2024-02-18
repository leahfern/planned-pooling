import Dimensions from './Dimensions.jsx';

const GraphEditor = (props) => {
  const {
    width,
    height,
    setGraphWidth,
    setGraphHeight,
    showGridlines,
    setShowGridlines,
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
      <div>
        <input
          type="checkbox"
          checked={showGridlines}
          onChange={handleShowHideGridlines}
          id="showGridlines"
        />
        <label htmlFor="showGridlines">Show gridlines</label>
      </div>
    </div>
  );
};

export default GraphEditor;
