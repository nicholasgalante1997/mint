import React, { memo } from 'react';

import { Header } from '@/components';
import { ThemeContextProvider } from '@/contexts';
import { wrapComponent } from '@/lib';
import { CouchFont, Text } from '@/components/web/Text';

const HomePageClassNames = {
  BodyContainer: 'couch-mint__home-page-body-container',
  TextContainer: 'couch-mint__home-page-text-container',
  Title: 'couch-mint__home-page-title-text',
  Subtitle: 'couch-mint__home-page-subtitle-text'
} as const;

function HomePageComponent() {
  return (
    <React.Fragment>
      <Header />
      <div className={HomePageClassNames.BodyContainer}>
        <div className={HomePageClassNames.TextContainer}>
          <Text as="h1" font={CouchFont.Newake} className={HomePageClassNames.Title}>
            mint.
          </Text>
          <Text as="p" font={CouchFont.ModernSans} className={HomePageClassNames.Subtitle}>
            A minimal technology blog.
          </Text>
        </div>
      </div>
    </React.Fragment>
  );
}

const Home = memo(wrapComponent([ThemeContextProvider], HomePageComponent));

export { Home };
