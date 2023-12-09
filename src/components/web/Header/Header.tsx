import React, { memo } from 'react';

import { useThemeContext } from '@/contexts';

import { Text, CouchFont } from '@/components/web/Text';

import { HeaderClassNames } from './HeaderMeta';
import { HeaderIcon } from './HeaderIcon';
import { keyDown } from '@/lib';

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
      >
        <HeaderIcon />
        <Text as="span" font={CouchFont.Newake}>
          Mint.
        </Text>
      </div>
      <div className={HeaderClassNames.LinkContainer}>
        <a target="_self" href="/browse-articles.html" className="link">
          Article Repository
        </a>
        <a target="_self" href="/subscription" className="link">
          Subscribe To Mint
        </a>
        <a className="link" href="/note-from-the-editor.html">
          Editorial
        </a>
        <a className="link" target="_self" href="/settings.html">
          Settings
        </a>
      </div>
    </header>
  );
});

export { Header };
