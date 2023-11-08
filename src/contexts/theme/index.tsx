import React, { createContext, memo, useContext, useState } from 'react';
import { ThemeContextType, ThemeContextProviderProps, ThemeModeType } from './types';

const defaultContext: ThemeContextType = {
  dispatchThemeUpdate(nextTheme) {}
};

const ThemeContext = createContext(defaultContext);
export const useThemeContext = () => useContext(ThemeContext);

const ThemeContextProvider = memo(function ({ children }: ThemeContextProviderProps) {
  const [mode, setMode] = useState<ThemeModeType>('light');
  return (
    <ThemeContext.Provider value={{ dispatchThemeUpdate: setMode }}>
      <div id="couch-mint__theme" data-mode={mode}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
});

export { ThemeContextProvider };
