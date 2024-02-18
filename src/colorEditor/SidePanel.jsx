import ColorList from './ColorList.jsx';

const SidePanel = (props) => {
  const { colorSequence, setColorSequence, showSidePanel, setShowSidePanel } =
    props;
  const width = showSidePanel ? 350 : 'fit-content';
  const displayContent = showSidePanel ? 'flex' : 'none';

  const sidePanelStyles = {
    width: width,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 20,
    height: '100vh',
    boxShadow: '-5px 0px 5px 1px #eeeeee',
    padding: 10,
  };
  const buttonContainerStyles = {
    display: 'flex',
  };
  const sidePanelContentStyles = {
    display: displayContent,
    flexDirection: 'column',
  };
  const openCloseIcon = showSidePanel ? '>' : '...';
  const toggleSidePanel = () => {
    setShowSidePanel(!showSidePanel);
  };
  return (
    <div style={sidePanelStyles}>
      <div style={buttonContainerStyles}>
        <button
          onClick={toggleSidePanel}
          width="fit-content"
          data-testid="toggleSidePanelButton"
        >
          {openCloseIcon}
        </button>
      </div>
      <div style={sidePanelContentStyles} data-testid="sidePanelContent">
        <h2 style={{ width: '100%' }}>Color sequence</h2>
        <ColorList
          colorSequence={colorSequence}
          setColorSequence={setColorSequence}
        />
      </div>
    </div>
  );
};

export default SidePanel;
