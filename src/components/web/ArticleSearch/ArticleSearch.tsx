import React, { memo, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useBrowsePageStore } from '@/store';
import { Conditional } from '@/components/logical';
import { Card } from '../Card';
import { buildLocalHrefFromArticleFilePath } from '@/lib';

const ArticleSearchClassNames = {
  root: 'couch-mint__article-search-container',
  search: 'couch-mint__card-search-input',
  overlay: 'couch-mint__card-search-overlay'
} as const;

function ArticleSearchComponent() {
  const { articles, filters, updateSearch } = useBrowsePageStore();
  const fuse = useMemo(
    () =>
      new Fuse(articles.all, {
        keys: ['display.title', 'display.subtitle', 'display.tags.keys'],
        includeScore: true,
        threshold: 0.9
      }),
    []
  );
  const results = useMemo(
    () => (filters.search ? fuse.search(filters.search) : []),
    [filters.search, fuse]
  );
  return (
    <div className={ArticleSearchClassNames.root}>
      <input
        type="search"
        placeholder="Search for an article"
        value={filters.search}
        onChange={(e) => updateSearch(e.target.value)}
        className={ArticleSearchClassNames.search}
      />
      <Conditional condition={!!filters.search}>
        <div className={ArticleSearchClassNames.overlay} role="menu">
          {results
            .sort((a, b) => {
              if (a.score! < b.score!) return -1;
              else if (a.score! === b.score!) return 0;
              else return 1;
            })
            .map(({ item }) => (
              <Card
                size="sm"
                type="mini"
                cta={{ text: 'Read', href: buildLocalHrefFromArticleFilePath(item.contentPath) }}
                description={item.display.subtitle}
                title={item.display.title}
                key={JSON.stringify(item)}
              />
            ))}
        </div>
      </Conditional>
    </div>
  );
}

export const ArticleSearch = memo(ArticleSearchComponent);
