import ColorPicker from './ColorPicker';

const ColorItem = (props) => {
  const {
    colorItem,
    updateColorItem,
    textColor,
    colorSequence,
    setColorSequence,
  } = props;

  const handleColorChange = (newColor) => {
    updateColorItem({ ...colorItem, color: newColor });
  };

  const handleCountChange = (e) => {
    const inputValue = e.target.value;
    const newCount = inputValue ? parseInt(inputValue, 10) : 0; // Default to 0 if input is empty
    updateColorItem({ ...colorItem, count: newCount });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    const newSequence = colorSequence.filter(
      (color) => color.sequence !== colorItem.sequence
    );
    const reorderedSequence = newSequence.map((color) =>
      color.sequence > colorItem.sequence
        ? { ...color, sequence: color.sequence - 1 }
        : color
    );
    setColorSequence(reorderedSequence);
  };

  return (
    <div
      style={{
        background: colorItem.color,
        color: textColor, // Set text color dynamically
        padding: 5,
        border: '1px solid gray',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        position: 'relative',
      }}
      data-testid={`color-item-${colorItem.sequence}`}
    >
      <div style={{ display: 'flex' }}>
        <label htmlFor="colorPicker">color:</label>
        <ColorPicker
          color={colorItem.color}
          onChange={handleColorChange}
          id="colorPicker"
        />
      </div>
      <div>
        <label htmlFor="stitchCount">stitches:</label>
        <input
          defaultValue={colorItem.count}
          onChange={handleCountChange}
          type="number"
          max={100}
          min={1}
        />
      </div>
      <button onClick={handleDelete}>delete color</button>
    </div>
  );
};

export default ColorItem;
