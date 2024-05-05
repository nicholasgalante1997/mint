import React, { memo } from 'react';
import { Body } from 'heller-2-react';

import { UilBracketsCurly, UilDocumentLayoutRight, UilMoon, UilSun, UilUserCircle } from '@iconscout/react-unicons';

import { useThemeContext } from '@/contexts';

import { HeaderClassNames } from './HeaderMeta';
import { colorBaseBluePrimary } from 'heller-2-lite';

const Header = memo(function HeaderComponent() {
  const { mode, dispatchThemeUpdate } = useThemeContext();
  return (
    <header className={HeaderClassNames.Container} data-theme={mode}>
      <a
        target="_self"
        href="/"
        className={HeaderClassNames.HomeContainer}
        role="button"
      >
        <UilBracketsCurly size="32px" fill={colorBaseBluePrimary} />
        <Body as="span" className="couch-mint__highrise-bold">
          Mint.
        </Body>
      </a>
      <div className={HeaderClassNames.LinkContainer}>
        <a target="_self" href="/browse-articles.html" className="icon-link link couch-mint__ls">
          <UilDocumentLayoutRight size="16px" fill={mode === 'dark' ? '#fff' : colorBaseBluePrimary} />
          Posts
        </a>
        <a target="_self" href="/author" className="icon-link link couch-mint__ls">
          <UilUserCircle size="16px" fill={mode === 'dark' ? '#fff' : colorBaseBluePrimary} />
          About
        </a>
        <span id="theme-toggle">
          <UilMoon onClick={dispatchThemeUpdate.bind({}, 'dark')} size="16px" fill={mode === 'dark' ? '#fff' : colorBaseBluePrimary} />
          <UilSun onClick={dispatchThemeUpdate.bind({}, 'light')} size="16px" fill={mode === 'dark' ? '#fff' : colorBaseBluePrimary} />
        </span>
      </div>
    </header>
  );
});

export { Header };
