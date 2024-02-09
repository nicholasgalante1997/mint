import ArticlesJson from './data/articles.json';

type Article = (typeof ArticlesJson)[number];

type BrowsePageStoreState = {
  articles: {
    all: Article[];
  };
};

type BrowsePageStoreActions = {
  requestArticle(key: string): Article | undefined;
};

export { Article, BrowsePageStoreActions, BrowsePageStoreState };
