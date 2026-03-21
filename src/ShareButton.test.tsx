import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ShareButton } from './ShareButton';

describe('ShareButton', () => {
  const mockWriteText = jest.fn();

  beforeEach(() => {
    mockWriteText.mockReset().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      configurable: true,
      writable: true,
    });
  });

  it('renders a Share button', () => {
    render(
      <MemoryRouter>
        <ShareButton />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('copies URL to clipboard on click', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ShareButton />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining('http'));
  });

  it('calls onCopySuccess when copy succeeds', async () => {
    const onCopySuccess = jest.fn();
    render(
      <MemoryRouter>
        <ShareButton onCopySuccess={onCopySuccess} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    await waitFor(() => {
      expect(onCopySuccess).toHaveBeenCalled();
    });
  });

  it('calls onCopyError when copy fails', async () => {
    mockWriteText.mockRejectedValueOnce(new Error('Copy failed'));
    const onCopyError = jest.fn();
    render(
      <MemoryRouter>
        <ShareButton onCopyError={onCopyError} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    await waitFor(() => {
      expect(onCopyError).toHaveBeenCalled();
    });
  });
});
