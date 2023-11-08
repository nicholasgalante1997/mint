type ThemeContextProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  dispatchThemeUpdate(next: ThemeModeType): void;
};

type ThemeModeType = 'dark' | 'light' | 'alt';

export { type ThemeContextType, type ThemeContextProviderProps, type ThemeModeType };
