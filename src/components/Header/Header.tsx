import React, { memo } from 'react';
import { Body } from 'heller-2-react';

import { UilMoon, UilSun, UilBars } from '@iconscout/react-unicons';

import { useThemeContext } from '@/contexts';

import { HeaderClassNames } from './HeaderMeta';
import { colorBaseBluePrimary } from 'heller-2-lite';
import { useAsideOverlayContext } from '@/contexts/AsideOverlay';

const Header = memo(function HeaderComponent() {
  const { mode, dispatchThemeUpdate } = useThemeContext();
  const { open } = useAsideOverlayContext();
  return (
    <header className={HeaderClassNames.Container} data-theme={mode}>
      <button onClick={open}>
        <UilBars size="24px" fill={colorBaseBluePrimary} />
      </button>
      <a target="_self" href="/" className={HeaderClassNames.HomeContainer} role="button">
        <Body as="span" className="couch-mint__newake" style={{ color: colorBaseBluePrimary }}>
          Mint.
        </Body>
      </a>
      <div className={HeaderClassNames.LinkContainer}>
        <span id="theme-toggle">
          <span onClick={dispatchThemeUpdate.bind({}, 'dark')} data-theme-tab="dark">
            <UilMoon size="16px" fill={mode === 'light' ? '#fff' : colorBaseBluePrimary} />
          </span>
          <span onClick={dispatchThemeUpdate.bind({}, 'light')} data-theme-tab="light">
            <UilSun size="16px" fill={mode === 'light' ? '#fff' : colorBaseBluePrimary} />
          </span>
        </span>
      </div>
    </header>
  );
});

export { Header };
