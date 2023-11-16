import { create } from 'zustand';
import isEqual from 'lodash.isequal';

import ArticlesJson from './data/articles.json';
import { type BrowsePageStoreActions, type BrowsePageStoreState } from './browse.types';

const useBrowsePageStore = create<BrowsePageStoreState & BrowsePageStoreActions>((set) => {
  return {
    articles: {
      all: ArticlesJson
    },
    filters: {
      activeFilters: new Set(),
      search: ''
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
        return {
          filters: {
            search: store.filters.search,
            activeFilters
          }
        };
      });
    },
    updateSearch(term) {
      return set((store) => {
        return {
          filters: {
            activeFilters: store.filters.activeFilters,
            search: term
          }
        };
      });
    }
  };
});

export { useBrowsePageStore };
