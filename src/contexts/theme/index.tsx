import React, { createContext, memo, useContext, useEffect, useState } from 'react';
import { ThemeContextType, ThemeContextProviderProps, ThemeModeType } from './types';

const defaultContext: ThemeContextType = {
  dispatchThemeUpdate(nextTheme) {},
  mode: 'light'
};

const ThemeContext = createContext(defaultContext);
export const useThemeContext = () => useContext(ThemeContext);

const ThemeContextProvider = memo(function ThemeContextProviderComponent({
  children,
  initialMode = 'light'
}: ThemeContextProviderProps) {
  const [mode, setMode] = useState<ThemeModeType>(/* initialMode */ 'dark');

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('@couch-mint/theme');
    if (storedTheme) {
      setMode(storedTheme as ThemeModeType);
    }
  }, []);

  useEffect(() => {
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.dataset.theme = mode;
    }

    window.localStorage.setItem('@couch-mint/theme', mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ dispatchThemeUpdate: setMode, mode }}>
      <div suppressHydrationWarning id="couch-mint__theme" data-mode={mode}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
});

export { ThemeContextProvider };
