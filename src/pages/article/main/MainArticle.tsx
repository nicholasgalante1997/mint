import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { CouchFont, Header, Text } from '@/components';
import { wrapComponent } from '@/lib';
import { ThemeContextProvider } from '@/contexts';

import { MainArticleClassNames } from './MainArticleMeta';
import { MainArticleProps } from './types';
import { CodeBlock } from '@/components/web/CodeBlock';

function MainArticleComponent({
  public: { markdown, publishing, image, subtitle, title }
}: MainArticleProps) {
  async function onCopy() {
    if (typeof window !== 'undefined') {
      window.navigator && (await window.navigator.clipboard.writeText(window.location.href));
    }
  }
  return (
    <React.Fragment>
      <Header />
      <div className={MainArticleClassNames.ImageContainer}>
        <img alt={image.alt} src={image.src} height="100%" width="100%" loading="eager" />
      </div>
      <Text className={MainArticleClassNames.Title} as="h1" font={CouchFont.Newake}>
        {title}
      </Text>
      <Text className={MainArticleClassNames.Subtitle} as="p" font={CouchFont.ModernSans}>
        {subtitle}
      </Text>
      <div className={MainArticleClassNames.MetadataRow}>
        <div>
          <span className={MainArticleClassNames.Author}>by Nick Galante</span>
          <span className={MainArticleClassNames.Date}>{publishing.date}</span>
        </div>
        <div>
          <button onClick={onCopy} className={MainArticleClassNames.ShareButton}>
            Share
          </button>
        </div>
      </div>
      <div className={MainArticleClassNames.MarkdownContainer}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }} children={markdown} />
      </div>
    </React.Fragment>
  );
}

export const MainArticle = memo<MainArticleProps>(
  wrapComponent([ThemeContextProvider], MainArticleComponent)
);
