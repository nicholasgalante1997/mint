import React, { createContext, memo, useContext, useEffect, useState } from 'react';
import { ThemeContextType, ThemeContextProviderProps, ThemeModeType } from './types';

const defaultContext: ThemeContextType = {
  dispatchThemeUpdate(nextTheme) {
    this.mode = nextTheme;
  },
  mode: 'light'
};

const ThemeContext = createContext(defaultContext);
export const useThemeContext = () => useContext(ThemeContext);

const ThemeContextProvider = memo(function ThemeContextProviderComponent({
  children
}: ThemeContextProviderProps) {
  const [mode, setMode] = useState<ThemeModeType>(/* initialMode */ 'dark');
  return (
    <ThemeContext.Provider value={{ dispatchThemeUpdate: setMode, mode }}>
      <div suppressHydrationWarning className="heller2-theme" data-theme-mode={mode}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
});

export { ThemeContextProvider };
