import React, { memo } from 'react';
import { Body } from 'heller-2-react';

import {
  UilBracketsCurly,
  UilDocumentLayoutRight,
  UilMoon,
  UilSun,
  UilUserCircle
} from '@iconscout/react-unicons';

import { useThemeContext } from '@/contexts';

import { HeaderClassNames } from './HeaderMeta';
import { colorBaseBluePrimary } from 'heller-2-lite';

function isActiveHeader(href: RegExp) {
  if (typeof window !== 'undefined') {
    const { pathname } = window.location;
    return href.test(pathname);
  }
  return false;
}

const Header = memo(function HeaderComponent() {
  const { mode, dispatchThemeUpdate } = useThemeContext();
  return (
    <header className={HeaderClassNames.Container} data-theme={mode}>
      <a target="_self" href="/" className={HeaderClassNames.HomeContainer} role="button">
        <UilBracketsCurly size="32px" fill={colorBaseBluePrimary} />
        <Body as="span" className="couch-mint__highrise-bold">
          Mint.
        </Body>
      </a>
      <div className={HeaderClassNames.LinkContainer}>
        <a
          data-current-page={isActiveHeader(/browse-articles(.html)?/g) ? 'self' : 'other'}
          target="_self"
          href="/browse-articles.html"
          className="icon-link link couch-mint__ls"
        >
          <UilDocumentLayoutRight size="16px" fill={mode === 'dark' ? '#fff' : colorBaseBluePrimary} />
          Posts
        </a>
        <a
          data-current-page={isActiveHeader(/profile(.html)?/g) ? 'self' : 'other'}
          target="_self"
          href="/profile.html"
          className="icon-link link couch-mint__ls"
        >
          <UilUserCircle size="16px" fill={mode === 'dark' ? '#fff' : colorBaseBluePrimary} />
          About
        </a>
        <span id="theme-toggle">
          <span onClick={dispatchThemeUpdate.bind({}, 'dark')} data-theme-tab="dark">
            <UilMoon
              size="16px"
              fill={mode === 'light' ? '#fff' : colorBaseBluePrimary}
            />
          </span>
          <span onClick={dispatchThemeUpdate.bind({}, 'light')} data-theme-tab="light">
            <UilSun
              size="16px"
              fill={mode === 'light' ? '#fff' : colorBaseBluePrimary}
            />
          </span>
        </span>
      </div>
    </header>
  );
});

export { Header };
