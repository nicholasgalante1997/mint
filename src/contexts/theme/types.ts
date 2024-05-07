interface ThemeContextProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeModeType;
}

interface ThemeContextType {
  dispatchThemeUpdate: (next: ThemeModeType) => void;
  mode: ThemeModeType;
}

type ThemeModeType = 'dark' | 'light' | 'alt';

export { type ThemeContextType, type ThemeContextProviderProps, type ThemeModeType };
