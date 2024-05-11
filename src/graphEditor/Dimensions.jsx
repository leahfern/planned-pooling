const Dimensions = (props) => {
  const { width, height, setGraphWidth, setGraphHeight } = props;

  const dimensionsStyling = {
    width: '100%',
  };
  const inputPanelStyling = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  };
  const inputContainerStyling = {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
  };
  const selectWidth = (e) => {
    setGraphWidth(e.target.value);
  };
  const selectHeight = (e) => {
    setGraphHeight(e.target.value);
  };
  return (
    <div style={dimensionsStyling}>
      <h1 style={{ textAlign: 'center' }}>Planned Pooling Helper</h1>
      <h2>Number of stitches:</h2>
      <div style={inputPanelStyling}>
        <div style={inputContainerStyling}>
          <input
            type="number"
            className="editorInput"
            defaultValue={width}
            onChange={selectWidth}
            max={1000}
            min={1}
          />
          <span>Stitches per row</span>
        </div>
        <div style={inputContainerStyling}>
          <input
            type="number"
            className="editorInput"
            defaultValue={height}
            onChange={selectHeight}
            max={1000}
            min={1}
          />
          <span>Number of rows</span>
        </div>
      </div>
    </div>
  );
};

export default Dimensions;
