import { useEffect, useRef } from 'react';

export const usePolling = (callback: () => Promise<void> | void, interval: number, dependencies: any[] = []) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    if (interval !== null) {
      const id = setInterval(tick, interval);
      return () => clearInterval(id);
    }
  }, [interval, ...dependencies]);
};
