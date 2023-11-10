import { Home } from './home';

enum PageIndexKey {
  Index = '@mint-home-page'
}

const PageIndex = new Map<PageIndexKey, React.ComponentType<any>>();

PageIndex.set(PageIndexKey.Index, Home);

export { PageIndexKey, PageIndex };
