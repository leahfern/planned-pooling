import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import useUrlParams from './useUrlParams';
import type { AppParams } from '../types';
import { BACK_AND_FORTH } from '../modules/stitchPatterns';

// Stable reference so useEffect in useUrlParams doesn't loop
const defaultParams: AppParams = {
  graphLength: 41,
  graphHeight: 20,
  showGridlines: true,
  highlightCurrentRowOnGrid: false,
  stitchPattern: BACK_AND_FORTH,
  colorSequence: [],
  showSidePanel: true,
  zoom: 1.35,
  hookNeedleSize: '',
  hookNeedleSizeOther: '',
  stitchType: '',
  stitchTypeOther: '',
  lotNumber: '',
  notes: '',
  yarnBrand: '',
  yarnName: '',
  yarnColorway: '',
};

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      {children}
    </MemoryRouter>
  );
}

describe('useUrlParams', () => {
  it('returns default params when URL has no search', () => {
    const { result } = renderHook(() => useUrlParams(defaultParams), {
      wrapper,
    });
    const [params] = result.current;
    expect(params.graphLength).toBe(41);
    expect(params.graphHeight).toBe(20);
    expect(params.showGridlines).toBe(true);
  });

  it('reads params from URL search', () => {
    const WrapperWithSearch = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={['/?graphLength=30&graphHeight=20']} initialIndex={0}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => useUrlParams(defaultParams), {
      wrapper: WrapperWithSearch,
    });
    const [params] = result.current;
    expect(params.graphLength).toBe(30);
    expect(params.graphHeight).toBe(20);
  });

  it('setParams updates state and can be read', () => {
    const { result } = renderHook(() => useUrlParams(defaultParams), {
      wrapper,
    });
    const [, setParams] = result.current;
    act(() => {
      setParams({ ...defaultParams, graphLength: 50 });
    });
    expect(result.current[0].graphLength).toBe(50);
  });
});
