import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Graph from './Graph';
import { lightTheme } from '../theme';
import type { ColorSequenceItem } from '../types';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>);
}

const colorSequence: ColorSequenceItem[] = [
  { sequence: 1, hex: '#ff0000', count: 2, textColor: '#fff', name: 'Red' },
  { sequence: 2, hex: '#00ff00', count: 2, textColor: '#000', name: 'Green' },
];

describe('Graph', () => {
  it('renders one row div per row (height) with pixels per row (length)', () => {
    const { container } = renderWithTheme(
      <Graph
        length={4}
        height={3}
        showGridlines
        zoom={2}
        colorSequence={colorSequence}
        stitchPattern="back-and-forth"
      />
    );
    const rows = container.querySelectorAll('.row');
    expect(rows).toHaveLength(3);
    rows.forEach((row) => {
      expect(row.querySelectorAll('.pixel')).toHaveLength(4);
    });
  });
});
