import React, { createContext, memo, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';

import { CouchFont, Text } from '@/components/web/Text';

import { ThemeContextType, ThemeContextProviderProps, ThemeModeType } from './types';

const defaultContext: ThemeContextType = {
  dispatchThemeUpdate(nextTheme) {},
  mode: 'light'
};

const ThemeContext = createContext(defaultContext);
export const useThemeContext = () => useContext(ThemeContext);

const ThemeContextProvider = memo(function ThemeContextProviderComponent({
  children
}: ThemeContextProviderProps) {
  const [mode, setMode] = useState<ThemeModeType>('light');
  useEffect(() => {
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.dataset.theme = mode;
    }
  }, [mode]);
  return (
    <ThemeContext.Provider value={{ dispatchThemeUpdate: setMode, mode }}>
      <div id="couch-mint__theme" data-mode={mode}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
});

export { ThemeContextProvider };
