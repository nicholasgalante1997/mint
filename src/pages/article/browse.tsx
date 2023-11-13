import React, { memo, useMemo } from 'react';

import { Card, Header } from '@/components';
import { wrapComponent } from '@/lib';
import { ThemeContextProvider } from '@/contexts';
import { useBrowsePageStore } from '@/store';

const BrowsePageClassNames = {
  Container: 'couch-mint__browse-page-container',
  CardGridContainer: 'couch-mint__card-container',
  ActionContainer: 'couch-mint__card-action-container',
  CardWrappingGrid: 'couch-mint__card-wrapping-container',
  CardAsideColumn: 'couch-mint__card-aside-container'
} as const;

function BrowsePage() {
  const { articles, filters, updateFilter } = useBrowsePageStore();
  const allFilterTags = useMemo(() => new Set(Array.from(articles.all.map(({ display: { tags }}) => tags ))), []); /** This list could grow long, so we'll choose to memoize here. */

  

  return (
    <React.Fragment>
      <Header />
      <div className={BrowsePageClassNames.Container}>
        <div className={BrowsePageClassNames.CardGridContainer}>
          <div className={BrowsePageClassNames.ActionContainer}>
            {/* Genres as ButtonChips, Search Bar */}
          </div>
          <div className={BrowsePageClassNames.CardWrappingGrid}>{/* Cards */}</div>
        </div>
        <aside className={BrowsePageClassNames.CardAsideColumn}>

        </aside>
      </div>
    </React.Fragment>
  );
}

export const Browse = memo(wrapComponent([ThemeContextProvider], BrowsePage))