import React, { Suspense, memo, useCallback, useDeferredValue, useMemo } from 'react';

import { Card, Header } from '@/components';
import { wrapComponent, titleCase } from '@/lib';
import { ThemeContextProvider } from '@/contexts';
import { useBrowsePageStore } from '@/store';
import { ButtonChip } from '@/components/web/ButtonChip';

const BrowsePageClassNames = {
  Container: 'couch-mint__browse-page-container',
  CardGridContainer: 'couch-mint__card-container',
  ActionContainer: 'couch-mint__card-action-container',
  SearchContainer: 'couch-mint__card-search-container',
  Search: 'couch-mint__card-search-input',
  ButtonChipRow: 'couch-mint__card-button-chip-row',
  CardWrappingGrid: 'couch-mint__card-wrapping-container',
  CardAsideColumn: 'couch-mint__card-aside-container'
} as const;

function BrowsePage() {
  const { articles, filters, updateFilter, updateSearch } = useBrowsePageStore();

  const nicksPicks = articles.all.slice(0, 4);

  const filter = useCallback(
    (article: (typeof articles.all)[number]) => {
      if (filters.search && filters.activeFilters.size !== 0) {
        const term = filters.search.toLowerCase();
        const includesSearchTerm =
          article.display.title.toLowerCase().includes(term) ||
          article.display.subtitle.toLowerCase().includes(term) ||
          article.display.tags
            .map(({ keys }) => keys)
            .flat()
            .join(' ')
            .includes(term);
        let hasButtonChipsCategory = false;
        filters.activeFilters.forEach((filter) => {
          filter.keys.forEach((key) => {
            article.display.tags.forEach(({ keys }) => {
              keys.forEach((articleTagKey) => {
                if (articleTagKey === key) {
                  hasButtonChipsCategory = true;
                }
              });
            });
          });
        });
        return includesSearchTerm && hasButtonChipsCategory;
      } else if (filters.search) {
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
      } else if (filters.activeFilters.size) {
        let hasButtonChipsCategory = false;
        filters.activeFilters.forEach((filter) => {
          filter.keys.forEach((key) => {
            article.display.tags.forEach(({ keys }) => {
              keys.forEach((articleTagKey) => {
                if (articleTagKey === key) {
                  hasButtonChipsCategory = true;
                }
              });
            });
          });
        });
        return hasButtonChipsCategory;
      } else {
        return true;
      }
    },
    [filters.activeFilters, filters.search]
  );

  const visible = useMemo(() => articles.all.filter(filter), [filter]);

  const deferredVisible = useDeferredValue(visible);

  const chips = useMemo(() => {
    const tags = articles.all
      .map(({ display: { tags } }) => tags)
      .flat()
      .map(({ visible }) => visible);
    return Array.from(new Set(tags));
  }, []);

  return (
    <React.Fragment>
      <Header />
      <div className={BrowsePageClassNames.Container}>
        <div className={BrowsePageClassNames.CardGridContainer}>
          <div className={BrowsePageClassNames.ActionContainer}>
            <div className={BrowsePageClassNames.SearchContainer}>
              <input
                type="search"
                placeholder="Browse articles"
                value={filters.search}
                onChange={(e) => updateSearch(e.target.value)}
                className={BrowsePageClassNames.Search}
              />
            </div>
            <div className={BrowsePageClassNames.ButtonChipRow}>
              {chips.map((tag) => (
                <ButtonChip
                  key={tag}
                  onClick={() => {
                    const found = articles.all
                      .map(({ display }) => display.tags)
                      .flat()
                      .find((tagObj) => tagObj.keys.includes(tag));
                    if (found) {
                      updateFilter(found, 'add');
                    }
                  }}
                >
                  {titleCase(tag)}
                </ButtonChip>
              ))}
            </div>
          </div>
          <Suspense fallback={<p>Loading</p>}>
            <div suppressHydrationWarning className={BrowsePageClassNames.CardWrappingGrid}>
              {deferredVisible.map(({ display, key }) => (
                <Card
                  key={key}
                  size="lg"
                  type="full"
                  title={display.title}
                  description={display.subtitle}
                  image="https://coincu.com/wp-content/uploads/2022/07/111.png"
                  cta={{ text: 'Read', href: '#' }}
                />
              ))}
            </div>
          </Suspense>
        </div>
        <aside className={BrowsePageClassNames.CardAsideColumn}>
          {nicksPicks.map(({ display, key }) => (
            <Card
              key={key}
              size="lg"
              type="mini"
              title={display.title}
              description={display.subtitle}
              cta={{ text: 'Read', href: '#' }}
            />
          ))}
        </aside>
      </div>
    </React.Fragment>
  );
}

export const Browse = memo(wrapComponent([ThemeContextProvider], BrowsePage));
