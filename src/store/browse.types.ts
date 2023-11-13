import ArticlesJson from './data/articles.json';

type Article = (typeof ArticlesJson)[number];

type BrowsePageStoreState = {
  articles: {
    visible: Article[];
    all: Article[];
  };
  filters: {
    activeFilters: Set<Article['display']['tags'][number]>;
  };
};

type BrowsePageStoreActions = {
  updateFilter(filter: Article['display']['tags'][number], action: 'add' | 'remove'): void;
};

export { Article, BrowsePageStoreActions, BrowsePageStoreState };
