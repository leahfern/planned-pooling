import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Extends jest matchers

import App from './App';

describe('App', () => {
  test('renders App component', () => {
    render(<App />);
    expect(screen.getByText('Planned Pooling Helper')).toBeInTheDocument();
    expect(screen.getByText('Number of stitches:')).toBeInTheDocument();
    expect(screen.getByText('Color sequence')).toBeInTheDocument();
  });

  test('updates graph dimensions', () => {
    render(<App />);
    const widthInput = screen.getByLabelText('Stitches per row');
    const heightInput = screen.getByLabelText('Number of rows');
    fireEvent.change(widthInput, { target: { value: 30 } });
    fireEvent.change(heightInput, { target: { value: 25 } });
    expect(widthInput).toHaveValue(30);
    expect(heightInput).toHaveValue(25);
  });

  test('toggles gridlines visibility', () => {
    render(<App />);
    const gridlinesCheckbox = screen.getByLabelText('Show gridlines');
    const initialStatus = gridlinesCheckbox.checked; // Get the initial status
    fireEvent.click(gridlinesCheckbox);
    expect(gridlinesCheckbox.checked).toBe(!initialStatus); // Ensure it toggles
  });

  test('toggles side panel visibility', () => {
    render(<App />);

    // Check initial status of side panel visibility
    const sidePanel = screen.getByTestId('sidePanelContent');
    const initialStatus = sidePanel
      ? window.getComputedStyle(sidePanel).display !== 'none'
      : false;

    // Find and click the toggle button
    const toggleButton = screen.getByTestId('toggleSidePanelButton');
    fireEvent.click(toggleButton);

    // Check if the visibility has changed after clicking the toggle button
    const updatedStatus = sidePanel
      ? window.getComputedStyle(sidePanel).display !== 'none'
      : false;
    expect(updatedStatus).not.toBe(initialStatus);
  });
});
