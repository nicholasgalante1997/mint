import React, { Suspense, memo, useCallback, useDeferredValue, useMemo } from 'react';

import { Card, Header } from '@/components';
import { buildLocalHrefFromArticleFilePath, wrapComponent } from '@/lib';
import { ThemeContextProvider } from '@/contexts';
import { useBrowsePageStore } from '@/store';

import { BrowsePageClassNames } from './BrowseMeta';

function BrowsePage() {
  const { articles, filters } = useBrowsePageStore();

  const filter = useCallback(
    (article: (typeof articles.all)[number]) => {
      if (filters.search) {
        const term = filters.search.toLowerCase();
        return (
          article.display.title.toLowerCase().includes(term) ||
          article.display.subtitle.toLowerCase().includes(term) ||
          article.display.tags
            .map(({ keys }) => keys)
            .flat()
            .join(' ')
            .includes(term)
        );
      }
      return true;
    },
    [filters.search]
  );

  const visible = useMemo(() => articles.all.filter(filter), [filter]);

  const deferredVisible = useDeferredValue(visible);

  return (
    <React.Fragment>
      <Header />
      <div className={BrowsePageClassNames.Container}>
        <div className={BrowsePageClassNames.CardGridContainer}>
          <Suspense fallback={<p>Loading</p>}>
            <div suppressHydrationWarning className={BrowsePageClassNames.CardWrappingGrid}>
              {deferredVisible.map(({ display, key, contentPath }) => (
                <Card
                  key={key}
                  size="lg"
                  type="full"
                  title={display.title}
                  description={display.subtitle}
                  image="https://coincu.com/wp-content/uploads/2022/07/111.png"
                  cta={{ text: 'Read', href: buildLocalHrefFromArticleFilePath(contentPath) }}
                />
              ))}
            </div>
          </Suspense>
        </div>
      </div>
    </React.Fragment>
  );
}

export const Browse = memo(wrapComponent([ThemeContextProvider], BrowsePage));
