import React, { memo } from 'react';
import { ThemeContextProvider } from '@/contexts';
import { PageRootProps } from './types';

const PageRoot = memo(function ({ children }: PageRootProps) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
});

export { PageRoot };
