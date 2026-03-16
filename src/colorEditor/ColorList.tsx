import React from 'react';
import ColorItem from './ColorItem';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import type { ColorSequenceItem } from '../types';

interface ColorListProps {
  colorSequence: ColorSequenceItem[];
  setColorSequence: (seq: ColorSequenceItem[]) => void;
  showToast?: (message: string) => void;
}

const ColorList: React.FC<ColorListProps> = ({
  colorSequence,
  setColorSequence,
  showToast,
}) => {
  const updateColorItem = (colorItem: ColorSequenceItem) => {
    const newSequence = colorSequence.map((color) =>
      color.sequence === colorItem.sequence ? colorItem : color
    );
    setColorSequence(newSequence);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(colorSequence);
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);

    setColorSequence(
      reorderedItems.map((item, index) => ({ ...item, sequence: index + 1 }))
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="colorList">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {colorSequence.map((colorItem, index) => (
              <Draggable
                key={colorItem.sequence}
                draggableId={String(colorItem.sequence)}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ColorItem
                      colorItem={colorItem}
                      updateColorItem={updateColorItem}
                      colorSequence={colorSequence}
                      setColorSequence={setColorSequence}
                      showToast={showToast}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ColorList;
