import { useCallback } from 'react';

export const useDeleteHandler = (props) => {
  const { colorItem, colorSequence, setColorSequence } = props;

  const handleDelete = useCallback(
    (e) => {
      e.preventDefault();
      const shouldDelete = window.confirm(
        'Are you sure you want to delete this color?'
      );
      if (shouldDelete) {
        const newSequence = colorSequence.filter(
          (color) => color.sequence !== colorItem.sequence
        );
        const reorderedSequence = newSequence.map((color) =>
          color.sequence > colorItem.sequence
            ? { ...color, sequence: color.sequence - 1 }
            : color
        );
        setColorSequence(reorderedSequence);
      }
    },
    [colorItem, colorSequence, setColorSequence]
  );

  return handleDelete;
};
