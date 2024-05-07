import ArticlesJson from './data/articles.json';

type Article = (typeof ArticlesJson)[number];

interface BrowsePageStoreState {
  articles: {
    all: Article[];
  };
}

interface BrowsePageStoreActions {
  requestArticle: (key: string) => Article | undefined;
}

export type { Article, BrowsePageStoreActions, BrowsePageStoreState };
