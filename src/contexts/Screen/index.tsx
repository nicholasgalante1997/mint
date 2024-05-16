import React, { useContext, createContext, useEffect, useState, memo } from 'react';
import debounce from 'debounce';
import { ParentComponent } from '@/types';

interface ScreenContextType {
  screen: 'mobile' | 'tablet' | 'desktop' | null;
}

const defaultCtx: ScreenContextType = { screen: 'desktop' };

const ScreenContext = createContext(defaultCtx);
export const useScreenContext = () => useContext(ScreenContext);

function ScreenContextProvider({ children }: ParentComponent) {
  const [screen, setScreen] = useState<ScreenContextType['screen'] | null>(null);
  useEffect(function () {
    function updateStateOnResize() {
      const { availWidth } = window.screen;
      if (availWidth < 600) {
        setScreen('mobile');
      } else if (availWidth > 600 && availWidth < 1024) {
        setScreen('tablet');
      } else if (availWidth >= 1024) {
        setScreen('desktop');
      }
    }

    updateStateOnResize();

    const debouncedCallback = debounce(updateStateOnResize, 400);

    window.addEventListener('resize', debouncedCallback);
    return () => window.removeEventListener('resize', debouncedCallback);
  }, []);

  return <ScreenContext.Provider value={{ screen }}>{children}</ScreenContext.Provider>;
}

export default memo(ScreenContextProvider);
