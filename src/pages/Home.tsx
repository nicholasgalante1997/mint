import React, { memo } from 'react';
import { RoughNotationGroup } from 'react-rough-notation';
import { Body, Heading, Button } from 'heller-2-react';
import { colorBaseBluePrimary } from 'heller-2-lite';

import { Header, Notation } from '@/components';
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
        <RoughNotationGroup show={true}>
          <Notation length={45} color={colorBaseBluePrimary}>
            <div className={HomePageClassNames.TextContainer}>
              <Heading as="h1" className={HomePageClassNames.Title}>
                mint.
              </Heading>
              <Body as="p" className={HomePageClassNames.Subtitle}>
                A minimal technology blog.
              </Body>
            </div>
          </Notation>
        </RoughNotationGroup>
      </div>
    </React.Fragment>
  );
}

const Home = memo(wrapComponent([ThemeContextProvider], HomePageComponent));

export { Home };
