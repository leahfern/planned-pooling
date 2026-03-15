import ColorItem from './ColorItem.jsx';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ColorList = (props) => {
  const { colorSequence, setColorSequence, showToast } = props;

  // Callback function to update color
  const updateColorItem = (colorItem) => {
    const newSequence = colorSequence.map((color) =>
      color.sequence === colorItem.sequence ? colorItem : color
    );
    setColorSequence(newSequence);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

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
