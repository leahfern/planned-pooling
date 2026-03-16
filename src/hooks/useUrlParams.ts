import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { AppParams } from '../types';

type SetParamsFn = (newParams: AppParams) => void;

export default function useUrlParams(
  defaultParams: AppParams
): [AppParams, SetParamsFn] {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const getParam = useCallback(
    (paramName: keyof AppParams): AppParams[keyof AppParams] => {
      const paramValue = queryParams.get(paramName as string);
      if (paramValue === null) {
        return defaultParams[paramName];
      }
      try {
        return JSON.parse(paramValue) as AppParams[keyof AppParams];
      } catch {
        return paramValue === 'true' ? true : paramValue;
      }
    },
    [queryParams, defaultParams]
  );

  const [params, setParams] = useState<AppParams>(() => {
    const initialParams: AppParams = { ...defaultParams };
    (Object.keys(defaultParams) as (keyof AppParams)[]).forEach((key) => {
      (initialParams as unknown as Record<string, AppParams[keyof AppParams]>)[key] = getParam(key);
    });
    return initialParams;
  });

  const setUrlParams = useCallback<SetParamsFn>(
    (newParams) => {
      setParams(newParams);
      const newQueryParams = new URLSearchParams();
      (Object.entries(newParams) as [keyof AppParams, AppParams[keyof AppParams]][]).forEach(
        ([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            newQueryParams.set(key as string, JSON.stringify(value));
          } else {
            newQueryParams.set(key as string, String(value));
          }
        }
      );
      navigate({ search: newQueryParams.toString() });
    },
    [navigate]
  );

  useEffect(() => {
    const newParams: AppParams = { ...defaultParams };
    (Object.keys(defaultParams) as (keyof AppParams)[]).forEach((key) => {
      (newParams as unknown as Record<string, AppParams[keyof AppParams]>)[key] = getParam(key);
    });
    setParams(newParams);
  }, [defaultParams, getParam, location.search]);

  return [params, setUrlParams];
}
