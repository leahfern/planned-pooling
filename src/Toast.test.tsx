import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Toast } from './Toast';
import { lightTheme } from './theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>);
}

describe('Toast', () => {
  it('renders nothing when message is null or empty', () => {
    const { rerender, container } = renderWithTheme(<Toast message={null} />);
    expect(container.firstChild).toBeNull();
    rerender(
      <ThemeProvider theme={lightTheme}>
        <Toast message="" />
      </ThemeProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows message with accessible status region (success)', () => {
    renderWithTheme(<Toast message="Saved!" />);
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveTextContent('Saved!');
  });

  it('shows message for error type with same status semantics', () => {
    renderWithTheme(<Toast message="Failed" type="error" />);
    const region = screen.getByRole('status');
    expect(region).toHaveTextContent('Failed');
  });
});
