// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill for libs (e.g. jsPDF) that expect TextEncoder/TextDecoder in the environment
const { TextEncoder: TE, TextDecoder: TD } = require('util');
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TE;
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TD;
}

// Minimal canvas 2d context for GraphCanvas (jsdom does not implement getContext)
const noop = () => {};
const mock2d = {
  canvas: null as unknown as HTMLCanvasElement,
  fillRect: noop,
  clearRect: noop,
  getImageData: () => ({ data: new Uint8ClampedArray(0), width: 0, height: 0 }),
  putImageData: noop,
  createImageData: () => ({ data: new Uint8ClampedArray(0), width: 0, height: 0 }),
  setTransform: noop,
  drawImage: noop,
  save: noop,
  restore: noop,
  beginPath: noop,
  moveTo: noop,
  lineTo: noop,
  closePath: noop,
  stroke: noop,
  translate: noop,
  scale: noop,
  rotate: noop,
  arc: noop,
  fill: noop,
  measureText: () => ({ width: 0 }),
  transform: noop,
  rect: noop,
  clip: noop,
};
(HTMLCanvasElement.prototype as unknown as { getContext: (id: string) => unknown }).getContext =
  function (contextId: string) {
    if (contextId === '2d') {
      mock2d.canvas = this;
      return mock2d;
    }
    return null;
  };
