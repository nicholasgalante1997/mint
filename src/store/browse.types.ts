import ArticlesJson from './data/articles.json';

type Article = (typeof ArticlesJson)[number];

type BrowsePageStoreState = {
  articles: {
    all: Article[];
  };
  filters: {
    search: string | undefined;
    activeFilters: Set<Article['display']['tags'][number]>;
  };
};

type BrowsePageStoreActions = {
  updateFilter(filter: Article['display']['tags'][number], action: 'add' | 'remove'): void;
  updateSearch(term: string): void;
};

export { Article, BrowsePageStoreActions, BrowsePageStoreState };
