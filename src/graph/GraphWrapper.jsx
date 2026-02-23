import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { MIN_GRID_DIMENSION, MAX_GRID_DIMENSION } from '../constants/grid';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  width: fit-content;
`;

const EdgeZone = styled.div`
  position: absolute;
  z-index: 1;
  cursor: pointer;
  transition: background-color 0.15s ease;
  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
    opacity: 0.35;
  }
`;

const TopEdge = styled(EdgeZone)`
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
`;

const BottomEdge = styled(EdgeZone)`
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
`;

const LeftEdge = styled(EdgeZone)`
  top: 0;
  bottom: 0;
  left: 0;
  width: 20px;
`;

const RightEdge = styled(EdgeZone)`
  top: 0;
  bottom: 0;
  right: 0;
  width: 20px;
`;

const Popover = styled.div`
  position: fixed;
  z-index: 10;
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.grey};
  border-radius: ${(props) => props.theme.borderRadius?.button || '8px'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: ${(props) => props.theme.spacing.small};
  display: flex;
  gap: ${(props) => props.theme.spacing.small};
  flex-wrap: wrap;
  min-width: 120px;
`;

const PopoverTitle = styled.div`
  width: 100%;
  font-size: ${(props) => props.theme.fontSizes.small};
  color: ${(props) => props.theme.colors.grey};
  margin-bottom: 4px;
`;

const PopoverButton = styled.button`
  flex: 1;
  min-width: 36px;
`;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function GraphWrapper({
  children,
  graphLength,
  graphHeight,
  setgraphLength,
  setGraphHeight,
}) {
  const [popover, setPopover] = useState(null);
  const popoverRef = useRef(null);

  const handleEdgeClick = (e, type) => {
    e.stopPropagation();
    const offset = 8;
    setPopover({
      type,
      x: e.clientX + offset,
      y: e.clientY + offset,
    });
  };

  const adjust = (delta) => {
    if (!popover) return;
    if (popover.type === 'column') {
      setgraphLength(clamp(graphLength + delta, MIN_GRID_DIMENSION, MAX_GRID_DIMENSION));
    } else {
      setGraphHeight(clamp(graphHeight + delta, MIN_GRID_DIMENSION, MAX_GRID_DIMENSION));
    }
  };

  useEffect(() => {
    if (!popover) return;
    const close = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setPopover(null);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [popover]);

  return (
    <>
      <Wrapper>
        <TopEdge onClick={(e) => handleEdgeClick(e, 'row')} />
        <BottomEdge onClick={(e) => handleEdgeClick(e, 'row')} />
        <LeftEdge onClick={(e) => handleEdgeClick(e, 'column')} />
        <RightEdge onClick={(e) => handleEdgeClick(e, 'column')} />
        {children}
      </Wrapper>
      {popover && (
        <Popover
          ref={popoverRef}
          style={{ left: popover.x, top: popover.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <PopoverTitle>
            {popover.type === 'column' ? 'Columns' : 'Rows'}
          </PopoverTitle>
          <PopoverButton type="button" onClick={() => adjust(-5)}>-5</PopoverButton>
          <PopoverButton type="button" onClick={() => adjust(-1)}>-1</PopoverButton>
          <PopoverButton type="button" onClick={() => adjust(1)}>+1</PopoverButton>
          <PopoverButton type="button" onClick={() => adjust(5)}>+5</PopoverButton>
        </Popover>
      )}
    </>
  );
}
