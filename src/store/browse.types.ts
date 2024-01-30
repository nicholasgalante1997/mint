import ArticlesJson from './data/articles.json';

type Article = (typeof ArticlesJson)[number];

type BrowsePageStoreState = {
  articles: {
    all: Article[];
  };
  filters: {
    search: string | undefined;
  };
};

type BrowsePageStoreActions = {
  updateSearch(term: string): void;
};

export { Article, BrowsePageStoreActions, BrowsePageStoreState };
