import React, { memo } from 'react';
import { RoughNotationGroup } from 'react-rough-notation';
import { Body, Button, Heading, Link } from 'heller-2-react';
import {
  colorBaseBluePrimary,
  colorBaseGreenPrimary,
  colorBaseSynthwavePinkPrimary
} from 'heller-2-lite';
import { Layout, Notation, Shapes } from '@/components';

const HomePageClassNames = {
  BodyContainer: 'couch-mint__home-page-body-container',
  TextContainer: 'couch-mint__home-page-text-container',
  Title: 'couch-mint__home-page-title-text',
  Subtitle: 'couch-mint__home-page-subtitle-text couch-mint__ls',
  Link: 'couch-mint__home-page-link-to-browse-page'
} as const;

function navigateToBrowsePage() {
  if (typeof window !== "undefined") {
    window.location.assign("/browse-articles.html");
  }
}

function HomePageComponent() {
  return (
    <Layout>
      <div className={HomePageClassNames.BodyContainer}>
        <Heading as="h1" className={HomePageClassNames.Title}>
          Learn solid <span style={{ color: colorBaseGreenPrimary }}>Web Fundamentals</span>. Build
          better <span style={{ color: colorBaseBluePrimary }}>User Experiences.</span> Write cleaner and
          more <span style={{ color: colorBaseSynthwavePinkPrimary }}>maintainable code.</span>
        </Heading>
        <Button style={{ marginTop: '24px' }} onClick={navigateToBrowsePage} size="large" hover={{ animationType: 'background-transition' }}>
          Learn More
        </Button>
      </div>
      {/* <Shapes className="couch-mint__home-abstract-shape-art" /> */}
    </Layout>
  );
}

const Home = memo(HomePageComponent);

export { Home };
