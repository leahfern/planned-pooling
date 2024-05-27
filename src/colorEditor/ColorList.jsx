import ColorItem from './ColorItem.jsx';
import { useRef } from 'react';

const ColorList = (props) => {
  const { colorSequence, setColorSequence } = props;

  // Callback function to update color
  const updateColorItem = (colorItem) => {
    const newSequence = colorSequence.map((color) =>
      color.sequence === colorItem.sequence ? colorItem : color
    );
    setColorSequence(newSequence);
  };

  //--LIST SORTING FUNCTIONALITY--//

  //reference for dragItem and dragOverItem

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  //handlers
  const onDragStart = (e, index) => {
    dragItem.current = index;
    e.currentTarget.classList.add('dragging');
  };

  const onDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const onDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const onDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    const itemBeingDragged = colorSequence[dragItem.current];
    const remainingItems = colorSequence.filter(
      (item, index) => index !== dragItem.current
    );
    const reorderedItems = [
      ...remainingItems.slice(0, dragOverItem.current),
      itemBeingDragged,
      ...remainingItems.slice(dragOverItem.current),
    ];
    setColorSequence(
      reorderedItems.map((item, index) => ({ ...item, sequence: index + 1 }))
    );
  };

  return (
    <div>
      {colorSequence.map((colorItem, index) => (
        <ColorItem
          colorItem={colorItem}
          updateColorItem={updateColorItem}
          colorSequence={colorSequence}
          setColorSequence={setColorSequence}
          key={colorItem.sequence}
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={onDragOver}
          onDragEnter={(e) => onDragEnter(e, index)}
          onDragEnd={onDragEnd}
        />
      ))}
    </div>
  );
};

export default ColorList;
