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
      search: ''
    },
    updateSearch(term) {
      return set({
        filters: {
          search: term
        }
      });
    }
  };
});

export { useBrowsePageStore };
