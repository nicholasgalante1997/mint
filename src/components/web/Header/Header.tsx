import React, { memo } from 'react';

import { useThemeContext } from '@/contexts';

import { Text, CouchFont } from '@/components/web/Text';

import { HeaderClassNames } from './HeaderMeta';
import { HeaderIcon } from './HeaderIcon';

const Header = memo(function HeaderComponent() {
  const { mode } = useThemeContext();
  return (
    <header className={HeaderClassNames.Container} data-theme={mode}>
      <div className={HeaderClassNames.HomeContainer}>
        <HeaderIcon />
        <Text as="span" font={CouchFont.Newake}>
          Mint.
        </Text>
      </div>
      <div className={HeaderClassNames.LinkContainer}>
        <a className="link">Article Repository</a>
        <a className="link">Subscribe To Mint</a>
        <a className="link">Editorial</a>
      </div>
    </header>
  );
});

export { Header };
