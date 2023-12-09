import React, { memo } from 'react';

import { Header } from '@/components';
import { ThemeContextProvider } from '@/contexts';
import { wrapComponent } from '@/lib';
import { CouchFont, Text } from '@/components/web/Text';

const SettingsClassNames = {
  BodyContainer: 'settings__body-container',
  Heading: 'settings__heading',
  FormBody: 'settings__form-container'
} as const;

function SettingsPageComponent() {
  return (
    <React.Fragment>
      <Header />
      <div className={SettingsClassNames.BodyContainer}>
        <Text as="h1" font={CouchFont.Newake}>
          Settings
        </Text>
        <section className={SettingsClassNames.FormBody}>
          <aside>
            <div>
              <span>Theme</span>
            </div>
          </aside>
          <main></main>
        </section>
      </div>
    </React.Fragment>
  );
}

const Settings = memo(wrapComponent([ThemeContextProvider], SettingsPageComponent));

export { Settings };
