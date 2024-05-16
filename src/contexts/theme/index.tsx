import React, { createContext, memo, useContext, useEffect, useState } from 'react';
import { ThemeContextType, ThemeContextProviderProps, ThemeModeType } from './types';

const STORAGE_KEY = '@couch-gag/mint/theme' as const;

const defaultContext: ThemeContextType = {
  dispatchThemeUpdate(nextTheme) {
    this.mode = nextTheme;
  },
  mode: 'light'
};

const ThemeContext = createContext(defaultContext);
export const useThemeContext = () => useContext(ThemeContext);

function getDefaultTheme(): ThemeModeType {
  if (typeof window !== 'undefined') {
    return (window.localStorage.getItem(STORAGE_KEY) as ThemeModeType) || 'light';
  }
  return 'light';
}

const ThemeContextProvider = memo(function ThemeContextProviderComponent({
  children
}: ThemeContextProviderProps) {
  const [mode, setMode] = useState<ThemeModeType>(getDefaultTheme());
  useEffect(() => {
    const appElement = window.document.querySelector<HTMLDivElement>('#app');
    if (appElement) {
      appElement.dataset.theme = mode;
      window.localStorage.setItem(STORAGE_KEY, mode);
    }
  }, [mode]);
  return (
    <ThemeContext.Provider value={{ dispatchThemeUpdate: setMode, mode }}>
      <div suppressHydrationWarning className="heller2-theme" data-theme-mode={mode}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
});

export { ThemeContextProvider };
