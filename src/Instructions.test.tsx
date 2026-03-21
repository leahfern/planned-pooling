import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import Instructions from './Instructions';
import { lightTheme } from './theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>);
}

describe('Instructions', () => {
  it('renders toggle with "How to use"', () => {
    renderWithTheme(<Instructions />);
    expect(screen.getByRole('button', { name: /how to use/i })).toBeInTheDocument();
  });

  it('starts collapsed (content not visible)', () => {
    renderWithTheme(<Instructions />);
    expect(screen.queryByText(/what is planned pooling/i)).not.toBeInTheDocument();
  });

  it('expands and shows content when toggle is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<Instructions />);
    await user.click(screen.getByRole('button', { name: /how to use/i }));
    expect(screen.getByText(/what is planned pooling/i)).toBeInTheDocument();
  });

  it('collapses when toggle is clicked again', async () => {
    const user = userEvent.setup();
    renderWithTheme(<Instructions />);
    await user.click(screen.getByRole('button', { name: /how to use/i }));
    expect(screen.getByText(/what is planned pooling/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /how to use/i }));
    expect(screen.queryByText(/what is planned pooling/i)).not.toBeInTheDocument();
  });

  it('has aria-expanded that toggles', async () => {
    const user = userEvent.setup();
    renderWithTheme(<Instructions />);
    const toggle = screen.getByRole('button', { name: /how to use/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});
