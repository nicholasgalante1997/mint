import React, { memo } from 'react';

import { Body, Heading } from 'heller-2-react';

import { Header } from '@/components';
import { ThemeContextProvider } from '@/contexts';
import { wrapComponent } from '@/lib';

const HomePageClassNames = {
  BodyContainer: 'couch-mint__home-page-body-container',
  TextContainer: 'couch-mint__home-page-text-container',
  Title: 'couch-mint__home-page-title-text couch-mint__highrise-bold',
  Subtitle: 'couch-mint__home-page-subtitle-text couch-mint__ls'
} as const;

function HomePageComponent() {
  return (
    <React.Fragment>
      <Header />
      <div className={HomePageClassNames.BodyContainer}>
        <div className={HomePageClassNames.TextContainer}>
          <Heading as="h1" className={HomePageClassNames.Title}>
            mint.
          </Heading>
          <Body as="p" className={HomePageClassNames.Subtitle}>
            A minimal technology blog.
          </Body>
        </div>
      </div>
    </React.Fragment>
  );
}

const Home = memo(wrapComponent([ThemeContextProvider], HomePageComponent));

export { Home };
