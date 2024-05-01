import { Home } from './Home';
import { Browse } from './Browse';
import { MainArticle } from './Post';

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
