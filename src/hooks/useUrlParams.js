import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useMemo } from 'react';

const useUrlParams = (defaultParams) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const getParam = useCallback(
    (paramName) => {
      const paramValue = queryParams.get(paramName);
      if (paramValue === null) {
        return defaultParams[paramName];
      } else {
        try {
          return JSON.parse(paramValue);
        } catch (e) {
          return paramValue === 'true' ? true : paramValue;
        }
      }
    },
    [queryParams, defaultParams]
  );

  const [params, setParams] = useState(() => {
    const initialParams = {};
    Object.keys(defaultParams).forEach((key) => {
      initialParams[key] = getParam(key);
    });
    return initialParams;
  });

  const setUrlParams = useCallback(
    (newParams) => {
      const newQueryParams = new URLSearchParams(queryParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (typeof value === 'object') {
          newQueryParams.set(key, JSON.stringify(value));
        } else {
          newQueryParams.set(key, value);
        }
      });
      navigate({ search: newQueryParams.toString() });
    },
    [queryParams, navigate]
  );

  useEffect(() => {
    const newParams = {};
    Object.keys(defaultParams).forEach((key) => {
      newParams[key] = getParam(key);
    });
    setParams(newParams);
  }, [defaultParams, getParam, location.search]);

  return [params, setUrlParams];
};

export default useUrlParams;
