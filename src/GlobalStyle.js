import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Nunito:wght@400;600;700&family=Roboto:wght@400;700&display=swap');

  body {
    background-color: ${(props) => props.theme.colors.background || props.theme.colors.white};
    font-family: ${(props) => props.theme.fonts.primary};
    color: ${(props) => props.theme.colors.text};
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  button,
  button:hover,
  [role="button"] {
    cursor: pointer !important;
  }
  button {
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.white};
    border: none;
    padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.medium};
    font-size: ${(props) => props.theme.fontSizes.small};
    cursor: pointer;
    border-radius: ${(props) => props.theme.borderRadius?.button || '10px'};
    transition: filter 0.2s ease;
  }
  button:hover {
    filter: brightness(1.1);
  }

  select,
  select:hover {
    cursor: pointer !important;
  }
  select {
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.white};
    border: none;
    padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.medium};
    font-size: ${(props) => props.theme.fontSizes.small};
    cursor: pointer;
    border-radius: ${(props) => props.theme.borderRadius?.button || '10px'};
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
  }
  select:hover {
    filter: brightness(1.1);
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }

  /* Checkbox: accent (gold) so it stands out on teal top bar and elsewhere */
  input[type="checkbox"] {
    accent-color: ${(props) => props.theme.colors.accent};
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  /* Range slider: thin track (smaller than thumb), thumb straddles track like native */
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 18px;
    padding: 0;
    box-sizing: content-box;
    outline: none;
    display: block;
    /* Draw gradient only in a 4px-tall strip so the bar is thinner than the 18px thumb */
    background: linear-gradient(to right, ${(props) => props.theme.colors.accent} 0%, ${(props) => props.theme.colors.accent} var(--range-progress, 50%), ${(props) => props.theme.colors.grey} var(--range-progress, 50%), ${(props) => props.theme.colors.grey} 100%) no-repeat center / 100% 4px;
    border-radius: 0;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    margin-top: -7px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.accent};
    cursor: pointer;
    border: none;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  input[type="range"]::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
    background: transparent;
  }
  input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.accent};
    cursor: pointer;
    border: none;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  input[type="range"]::-moz-range-track {
    height: 4px;
    border-radius: 2px;
    background: ${(props) => props.theme.colors.grey};
  }

  /* Color picker: no shadow, teal accents; hide any close/X so user must use Cancel to discard */
  .app-color-picker-wrap .chrome-picker {
    box-shadow: none !important;
  }
  .app-color-picker-wrap .chrome-picker [class*="close"],
  .app-color-picker-wrap .chrome-picker [aria-label="Close"] {
    display: none !important;
  }
  /* Teal accents only on saturation/hue/alpha thumbs, not the HEX/RGB toggle */
  .app-color-picker-wrap .chrome-picker > div:not(:last-child) div[style*="cursor: pointer"] {
    background: ${(props) => props.theme.colors.primary} !important;
    color: white !important;
    border-radius: 10px !important;
    border: none !important;
    padding: 6px !important;
    min-width: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .app-color-picker-wrap .chrome-picker > div:not(:last-child) div[style*="cursor: pointer"]:hover {
    filter: brightness(1.1);
  }
  .app-color-picker-wrap .chrome-picker > div:not(:last-child) svg {
    fill: white !important;
  }
  /* HEX/RGB toggle: keep default look and a subtle hover so it doesn’t get messed up */
  .app-color-picker-wrap .chrome-picker > div:last-child div[style*="cursor: pointer"] {
    background: ${(props) => props.theme.colors.primary} !important;
    color: ${(props) => props.theme.colors.white} !important;
    border: 1px solid ${(props) => props.theme.colors.primary} !important;
    border-radius: 6px !important;
    min-width: 24px;
    padding: 0 !important;
    margin: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    outline: none !important;
    box-shadow: none !important;
  }
  .app-color-picker-wrap .chrome-picker > div:last-child div[style*="cursor: pointer"]:hover,
  .app-color-picker-wrap .chrome-picker > div:last-child div[style*="cursor: pointer"]:hover * {
    background: ${(props) => props.theme.colors.primary} !important;
    color: ${(props) => props.theme.colors.white} !important;
    filter: brightness(1.1);
    outline: none !important;
    box-shadow: none !important;
  }
  /* Inner container of toggle: keep teal so white arrows stay visible (no white background), no extra padding */
  .app-color-picker-wrap .chrome-picker > div:last-child div[style*="cursor: pointer"] div,
  .app-color-picker-wrap .chrome-picker > div:last-child div[style*="cursor: pointer"] div:hover {
    background: transparent !important;
    color: inherit !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .app-color-picker-wrap .chrome-picker > div:last-child div[style*="cursor: pointer"] svg,
  .app-color-picker-wrap .chrome-picker > div:last-child div[style*="cursor: pointer"] div svg {
    fill: ${(props) => props.theme.colors.white} !important;
  }
  .app-color-picker-wrap .chrome-picker input {
    border-radius: 8px !important;
    border: 1px solid ${(props) => props.theme.colors.grey} !important;
    box-shadow: none !important;
  }
  .app-color-picker-wrap .chrome-picker > div:first-child > div > div[style*="translate(-6px, -6px)"] {
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.8), 0 0 0 2px rgba(0,0,0,0.4) !important;
  }

  /* ChromePicker dark mode: when theme.dark is true, style the picker for dark backgrounds */
  ${(props) =>
    props.theme.dark
      ? `
  .app-color-picker-wrap .chrome-picker {
    background: ${props.theme.colors.cardBg} !important;
  }
  .app-color-picker-wrap .chrome-picker > div {
    background: transparent !important;
  }
  .app-color-picker-wrap .chrome-picker input,
  .app-color-picker-wrap .chrome-picker input[type="text"] {
    background: ${props.theme.colors.surface} !important;
    color: ${props.theme.colors.text} !important;
    border-color: ${props.theme.colors.grey} !important;
  }
  .app-color-picker-wrap .chrome-picker label,
  .app-color-picker-wrap .chrome-picker span:not([class]) {
    color: ${props.theme.colors.text} !important;
  }
  .app-color-picker-wrap .chrome-picker > div:last-child > div {
    color: ${props.theme.colors.text} !important;
  }
  .app-color-picker-wrap .chrome-picker a {
    color: ${props.theme.colors.primary} !important;
  }
  `
      : ''}
`;
