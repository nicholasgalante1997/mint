import React, { memo } from 'react';

import ScreenContextProvider from '@/contexts/Screen';
import { ThemeContextProvider } from '@/contexts';
import { AsideOverlayProviderComponent } from '@/contexts/AsideOverlay';
import { Header } from '../Header';

interface LayoutProps {
  children: React.ReactNode | React.ReactNode[];
}

function Layout({ children }: LayoutProps) {
  return (
    <ScreenContextProvider>
      <ThemeContextProvider>
        <AsideOverlayProviderComponent>
          <Header />
          {children}
        </AsideOverlayProviderComponent>
      </ThemeContextProvider>
    </ScreenContextProvider>
  );
}

export default memo(Layout);
