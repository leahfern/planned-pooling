import ColorList from './ColorList.jsx';
import AddColor from './AddColor.jsx';

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
    minHeight: '100vh',
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
  const openCloseIcon = showSidePanel ? 'chevron_right' : 'menu';
  const toggleSidePanel = () => {
    setShowSidePanel(!showSidePanel);
  };
  return (
    <div style={sidePanelStyles}>
      <div style={buttonContainerStyles}>
        <button
          onClick={toggleSidePanel}
          className="material-symbols-outlined"
          width="fit-content"
        >
          {openCloseIcon}
        </button>
      </div>
      <div style={sidePanelContentStyles}>
        <h2 style={{ width: '100%', textAlign: 'center' }}>Color list</h2>
        <ColorList
          colorSequence={colorSequence}
          setColorSequence={setColorSequence}
        />
      </div>
      <AddColor
        colorSequence={colorSequence}
        setColorSequence={setColorSequence}
      />
    </div>
  );
};

export default SidePanel;
