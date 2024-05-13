import React, { memo } from 'react';
import { RoughNotationGroup } from 'react-rough-notation';
import { Body, Button, Heading, Link } from 'heller-2-react';
import { colorBaseBluePrimary } from 'heller-2-lite';
import { Layout, Notation } from '@/components';

const HomePageClassNames = {
  BodyContainer: 'couch-mint__home-page-body-container',
  TextContainer: 'couch-mint__home-page-text-container',
  Title: 'couch-mint__home-page-title-text couch-mint__highrise-bold',
  Subtitle: 'couch-mint__home-page-subtitle-text couch-mint__ls',
  Link: 'couch-mint__home-page-link-to-browse-page'
} as const;

function HomePageComponent() {
  return (
    <Layout>
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
              <a className={HomePageClassNames.Link} target="_self" href="/browse-articles.html">
                Read Posts
              </a>
            </div>
          </Notation>
        </RoughNotationGroup>
      </div>
    </Layout>
  );
}

const Home = memo(HomePageComponent);

export { Home };
