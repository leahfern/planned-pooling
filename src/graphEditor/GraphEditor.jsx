import styled from 'styled-components';
import Dimensions from './Dimensions.jsx';
import { STITCH_PATTERNS } from '../modules/stitchPatterns';

const EditorContainer = styled.div`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const ControlsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${(props) => props.theme.spacing.large};
  flex-wrap: wrap;
`;

const ControlItem = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.small};
  font-size: ${(props) => props.theme.fontSizes.small};
  color: inherit;
  cursor: pointer;
`;

const ZoomLabel = styled.label`
  display: block;
  width: 100%;
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.small};
  color: inherit;
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 2;

const GraphEditor = (props) => {
  const {
    length,
    height,
    setgraphLength,
    setGraphHeight,
    showGridlines,
    setShowGridlines,
    stitchPattern,
    setStitchPattern,
    zoom = 1,
    setParams,
    params,
    maxDimension = 500,
  } = props;

  const handleShowHideGridlines = (e) => {
    setShowGridlines(!showGridlines);
  };

  const handleZoomChange = (e) => {
    const next = parseFloat(e.target.value, 10);
    setParams({ ...params, zoom: next });
  };

  return (
    <EditorContainer>
      <Dimensions
        width={length}
        height={height}
        setGraphHeight={setGraphHeight}
        setgraphLength={setgraphLength}
        maxDimension={maxDimension}
      />
      <ControlsContainer>
        <ControlItem>
          <CheckboxLabel>
            <input
              type="checkbox"
              checked={showGridlines}
              onChange={handleShowHideGridlines}
            />
            Show gridlines
          </CheckboxLabel>
        </ControlItem>
        <ControlItem>
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
        </ControlItem>
        <ControlItem style={{ flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
          <ZoomLabel htmlFor="zoom-slider">Zoom:</ZoomLabel>
          <input
            id="zoom-slider"
            type="range"
            min={ZOOM_MIN}
            max={ZOOM_MAX}
            step={0.05}
            value={zoom ?? 1}
            onChange={handleZoomChange}
            aria-label="Zoom"
            style={{ '--range-progress': `${(((zoom ?? 1) - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN)) * 100}%` }}
          />
        </ControlItem>
      </ControlsContainer>
    </EditorContainer>
  );
};

export default GraphEditor;
