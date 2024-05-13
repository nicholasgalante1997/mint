import { ThemeContextProvider } from '@/contexts';
import { AsideOverlayProviderComponent } from '@/contexts/AsideOverlay';
import React, { memo } from 'react';
import { Header } from '../Header';

interface LayoutProps {
  children: React.ReactNode | React.ReactNode[];
}

function Layout({ children }: LayoutProps) {
  return (
    <ThemeContextProvider>
      <AsideOverlayProviderComponent>
        <Header />
        {children}
      </AsideOverlayProviderComponent>
    </ThemeContextProvider>
  );
}

export default memo(Layout);
