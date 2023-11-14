import { create } from 'zustand';
import isEqual from 'lodash.isequal';

import ArticlesJson from './data/articles.json';
import { type BrowsePageStoreActions, type BrowsePageStoreState } from './browse.types';

const useBrowsePageStore = create<BrowsePageStoreState & BrowsePageStoreActions>((set) => {
  return {
    articles: {
      all: ArticlesJson,
      visible: ArticlesJson
    },
    filters: {
      activeFilters: new Set()
    },
    updateFilter(filter, action) {
      set((store) => {
        let activeFilters;
        if (action === 'add') {
          activeFilters = new Set([...store.filters.activeFilters, filter]);
        } else {
          activeFilters = new Set(
            Array.from(store.filters.activeFilters).filter(
              (activeFilter) => !isEqual(activeFilter, filter)
            )
          );
        }
        const flatArrayOfTags = Array.from(activeFilters)
          .map(({ keys }) => keys)
          .flat();
        const filteredArticles = ArticlesJson.filter((article) => {
          for (const articleTags of article.display.tags) {
            for (const keyTerm of articleTags.keys) {
              if (flatArrayOfTags.includes(keyTerm)) {
                return true;
              }
            }
          }
          return false;
        });
        return {
          ...store,
          articles: {
            ...store.articles,
            visible: filteredArticles
          },
          filters: {
            activeFilters
          }
        };
      });
    }
  };
});

export { useBrowsePageStore };
