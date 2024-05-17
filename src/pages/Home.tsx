import React, { memo } from 'react';
import { Button, Heading } from 'heller-2-react';

import { Layout } from '@/components';
import { WebDeveloperAnimation } from '@/components/WebDeveloperAnimation';

const HomePageClassNames = {
  BodyContainer: 'couch-mint__home-page-body-container',
  TextContainer: 'couch-mint__home-page-text-container',
  Title: 'couch-mint__home-page-title-text',
  Subtitle: 'couch-mint__home-page-subtitle-text couch-mint__ls',
  Link: 'couch-mint__home-page-link-to-browse-page'
} as const;

function navigateToBrowsePage() {
  if (typeof window !== 'undefined') {
    window.location.assign('/browse-articles.html');
  }
}

function HomePageComponent() {
  return (
    <Layout>
      <div className={HomePageClassNames.BodyContainer}>
        <WebDeveloperAnimation />
        <div className={HomePageClassNames.TextContainer}>
          <Heading as="h1" className={HomePageClassNames.Title}>
            Learn solid <span className="pop-green">Web Fundamentals</span>. Build
            better <span className="pop-blue">User Experiences.</span> Write cleaner
            and more <span className="pop-pink">maintainable code.</span>
          </Heading>
          <Button
            style={{ marginTop: '24px' }}
            onClick={navigateToBrowsePage}
            size="large"
            hover={{ animationType: 'background-transition' }}
          >
            Learn More
          </Button>
        </div>
      </div>
    </Layout>
  );
}

const Home = memo(HomePageComponent);

export { Home };
