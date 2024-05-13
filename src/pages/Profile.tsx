import React, { memo } from 'react';
import { Body, Heading } from 'heller-2-react';
import { colorBaseBluePrimary } from 'heller-2-lite';

import { Layout } from '@/components';

const ProfilePageClassNames = {
  main: 'couch-mint__bio-main-root',
  infoRoot: 'couch-mint__bio-info-root',
  avatarRoot: 'couch-mint__bio-image-root',
  name: 'couch-mint__bio-name'
} as const;

function ProfilePageComponent() {
  return (
    <Layout>
      <main className={ProfilePageClassNames.main}>
        <div className={ProfilePageClassNames.infoRoot}>
          <div className={ProfilePageClassNames.avatarRoot}>
            <img src="/doodles/doodles_pink.png" alt="A pink doodles nft." />
          </div>
          <div>
            <Heading
              style={{ color: colorBaseBluePrimary }}
              as="h1"
              className={ProfilePageClassNames.name}
            >
              Nick Galante
            </Heading>
            <Heading as="h4">
              Senior Software Engineer, Design Technologist IV @ Charter Communications
            </Heading>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export const Profile = memo(ProfilePageComponent);
