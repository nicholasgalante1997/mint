import { Home } from './home';
import { Browse } from './article/browse/Browse';
import { MainArticle } from './article/main/MainArticle';

enum PageIndexKey {
  Index = '@mint-home-page',
  Browse = '@mint-browse-page',
  MainArticle = '@mint-main-article-page'
}

const PageIndex = new Map<PageIndexKey, React.ComponentType<any>>();

PageIndex.set(PageIndexKey.Index, Home);
PageIndex.set(PageIndexKey.Browse, Browse);
PageIndex.set(PageIndexKey.MainArticle, MainArticle);

export { PageIndexKey, PageIndex };
