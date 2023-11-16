import { Home } from './home';
import { Browse } from './article/browse';

enum PageIndexKey {
  Index = '@mint-home-page',
  Browse = '@mint-browse-page'
}

const PageIndex = new Map<PageIndexKey, React.ComponentType<any>>();

PageIndex.set(PageIndexKey.Index, Home);
PageIndex.set(PageIndexKey.Browse, Browse);

export { PageIndexKey, PageIndex };
