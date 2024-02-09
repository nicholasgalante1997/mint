import React, { memo } from 'react';
import { Body } from 'heller-2-react';

import { UilBracketsCurly } from '@iconscout/react-unicons';

import { useThemeContext } from '@/contexts';
import { keyDown } from '@/lib';

import { HeaderClassNames } from './HeaderMeta';
import { colorBaseBluePrimary } from 'heller-2-lite';

const Header = memo(function HeaderComponent() {
  const { mode } = useThemeContext();
  const onHomeClick = () => {
    if (typeof window !== 'undefined') {
      window.location.assign('/');
    }
  };
  return (
    <header className={HeaderClassNames.Container} data-theme={mode}>
      <div
        onClick={onHomeClick}
        onKeyDown={keyDown(onHomeClick)}
        className={HeaderClassNames.HomeContainer}
        role="button"
      >
        <UilBracketsCurly size="32px" fill={colorBaseBluePrimary} />
        <Body as="span" className="couch-mint__highrise-bold">
          Mint.
        </Body>
      </div>
      <div className={HeaderClassNames.LinkContainer}>
        <a target="_self" href="/browse-articles.html" className="link couch-mint__ls">
          Article Repository
        </a>
        <a target="_self" href="/subscription" className="link couch-mint__ls">
          Subscribe To Mint
        </a>
        <a className="link couch-mint__ls" target="_self" href="/note-from-the-editor.html">
          Editorial
        </a>
        <a className="link couch-mint__ls" target="_self" href="/settings.html">
          Settings
        </a>
      </div>
    </header>
  );
});

export { Header };
