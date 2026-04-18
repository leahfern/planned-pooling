import React from 'react';
import styled from 'styled-components';
import Dimensions from './Dimensions';
import { STITCH_PATTERNS } from '../modules/stitchPatterns';
import type { AppParams } from '../types';

const EditorContainer = styled.div`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const ControlsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xlarge};
  flex-wrap: wrap;
  margin-top: ${(props) => props.theme.spacing.medium};
  padding-top: ${(props) => props.theme.spacing.medium};
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const ControlItem = styled.div`
  display: flex;
  align-items: center;
  min-height: 36px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.small};
  font-size: ${(props) => props.theme.fontSizes.small};
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  cursor: pointer;
`;

const ZoomLabel = styled.label`
  display: block;
  width: 100%;
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.small};
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4;

interface GraphEditorProps {
  length: number;
  height: number;
  setGraphLength: (n: number) => void;
  setGraphHeight: (n: number) => void;
  showGridlines: boolean;
  setShowGridlines: (v: boolean) => void;
  stitchPattern: string;
  setStitchPattern: (v: string) => void;
  zoom: number;
  setParams: (p: AppParams) => void;
  params: AppParams;
  maxDimension?: number;
}

const GraphEditor: React.FC<GraphEditorProps> = ({
  length,
  height,
  setGraphLength,
  setGraphHeight,
  showGridlines,
  setShowGridlines,
  stitchPattern,
  setStitchPattern,
  zoom = 1,
  setParams,
  params,
  maxDimension = 500,
}) => {
  const handleShowHideGridlines = () => {
    setShowGridlines(!showGridlines);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = parseFloat(e.target.value);
    setParams({ ...params, zoom: next });
  };

  return (
    <EditorContainer>
      <Dimensions
        width={length}
        height={height}
        setGraphHeight={setGraphHeight}
        setGraphLength={setGraphLength}
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
            style={{ ['--range-progress' as string]: `${(((zoom ?? 1) - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN)) * 100}%` }}
          />
        </ControlItem>
      </ControlsContainer>
    </EditorContainer>
  );
};

export default GraphEditor;
