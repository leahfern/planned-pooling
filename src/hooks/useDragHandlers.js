import { useCallback } from 'react';

export const useDragHandlers = (props) => {
  const { onDragStart, onDragOver, onDragEnter, onDragEnd } = props;

  const handleDragStart = useCallback(
    (event) => {
      onDragStart(event);
    },
    [onDragStart]
  );

  const handleDragOver = useCallback(
    (event) => {
      onDragOver(event);
    },
    [onDragOver]
  );

  const handleDragEnter = useCallback(
    (event) => {
      onDragEnter(event);
    },
    [onDragEnter]
  );

  const handleDragEnd = useCallback(
    (event) => {
      onDragEnd(event);
    },
    [onDragEnd]
  );

  return { handleDragStart, handleDragOver, handleDragEnter, handleDragEnd };
};
