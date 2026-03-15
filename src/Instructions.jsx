import { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const Toggle = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: ${(props) => props.theme.fontSizes.medium};
  font-weight: 600;
  color: inherit;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Content = styled.div`
  margin-top: ${(props) => props.theme.spacing.small};
  font-size: ${(props) => props.theme.fontSizes.medium};
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.5;
  a {
    color: ${(props) => props.theme.colors.accent};
    text-decoration: underline;
  }
  a:hover {
    color: ${(props) => props.theme.colors.white};
  }
`;

function Instructions() {
  const [open, setOpen] = useState(false);
  return (
    <Wrapper>
      <Toggle
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="How to use (expand or collapse)"
      >
        {open ? '▼' : '►'} How to use
      </Toggle>
      {open && (
        <Content>
          <p><strong>What is planned pooling?</strong> You use variegated yarn and a fixed stitch count so the colors line up into a repeating pattern (e.g. argyle, chevrons). This tool shows you how your colors will pool before you start.</p>
          <p><strong>Steps:</strong></p>
          <ol>
            <li><strong>Measure your yarn.</strong> Make a small swatch with your chosen hook/needle and stitch. Count how many stitches you get per color repeat (e.g. 3 red, 7 black, 3 blue, 1 white). That’s your “stitch count” per color.</li>
            <li><strong>Set grid size.</strong> Enter “Stitches per row” and “Number of rows” to match the size you want. Use the arrows to nudge by 1; small changes can fix alignment.</li>
            <li><strong>Add your colors.</strong> In the color list, add each color in order and set the stitch count for each. You can reorder by dragging and name colors for your legend.</li>
            <li><strong>Choose stitch pattern.</strong> “Back and forth” (rows alternate direction) or “In the round” — pick what you’re actually making.</li>
            <li><strong>Make a real swatch.</strong> Crochet or knit a swatch with your yarn and hook/needle to confirm tension. If the pooling is off, adjust stitches per row (or hook/needle size) and update the tool.</li>
          </ol>
          <p>Many people use <strong>moss stitch</strong> (granite stitch) for planned pooling because it gives a clear, consistent color layout.</p>
          <p>Use <strong>Share</strong> to copy the pattern URL, or <strong>Export image</strong> / <strong>Export PDF</strong> to save or print. Save your project or yarn in the sidebar to come back later.</p>
          <p>For a full walkthrough, see <a href="https://www.youtube.com/watch?v=sKSCPl7w6sA" target="_blank" rel="noopener noreferrer">Marly Bird’s “The Best Crochet Planned Pooling Tutorial”</a> on YouTube.</p>
        </Content>
      )}
    </Wrapper>
  );
}

export default Instructions;
