import { create } from 'zustand';

import ArticlesJson from './data/articles.json';
import { type BrowsePageStoreActions, type BrowsePageStoreState } from './browse.types';

const useBrowsePageStore = create<BrowsePageStoreState & BrowsePageStoreActions>((_set) => {
  return {
    articles: {
      all: ArticlesJson
    },
    requestArticle(key) {
      return ArticlesJson.find((article) => article.key === key);
    }
  };
});

export { useBrowsePageStore };
