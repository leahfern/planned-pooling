import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useCallback } from 'react';

export function withUrlParams(Component) {
  return function WrappedComponent(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = useMemo(
      () => new URLSearchParams(location.search),
      [location.search]
    );

    const getParam = (paramName, defaultValue) => {
      const paramValue = queryParams.get(paramName);
      if (paramValue === null) {
        return defaultValue;
      } else {
        try {
          // Try to parse the value as JSON. If it fails, return the original value.
          return JSON.parse(paramValue);
        } catch (e) {
          return paramValue === 'true' ? true : paramValue;
        }
      }
    };

    const setParams = useCallback(
      (newParams) => {
        const newQueryParams = new URLSearchParams(queryParams);
        Object.entries(newParams).forEach(([key, value]) => {
          if (typeof value === 'object') {
            // This will check for arrays and objects
            newQueryParams.set(key, JSON.stringify(value));
          } else {
            newQueryParams.set(key, value);
          }
        });
        navigate({ search: newQueryParams.toString() }, { replace: true });
      },
      [queryParams, navigate]
    );

    useEffect(() => {
      setParams(props);
    }, [props, setParams]);

    return <Component {...props} getParam={getParam} setParams={setParams} />;
  };
}
