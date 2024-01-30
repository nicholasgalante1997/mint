import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Body, Button, Heading } from 'heller-2-react';

import { Header } from '@/components';
import { wrapComponent } from '@/lib';
import { ThemeContextProvider } from '@/contexts';

import { MainArticleClassNames } from './MainArticleMeta';
import { MainArticleProps } from './types';
import { CodeBlock } from '@/components/web/CodeBlock';
import { Summary } from '@/components/web/Summary/Summary';

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
      
      <Heading className={MainArticleClassNames.Title} as="h1">
        {title}
      </Heading>
      
      <Summary content={subtitle} />

      <div className={MainArticleClassNames.MetadataRow}>
        <div>
          <Body as="span" className={MainArticleClassNames.Author}>by Nick Galante</Body>
          <Body as="span" className={MainArticleClassNames.Date}>{publishing.date}</Body>
        </div>
        <div>
          <Button size="small" rounded onClick={onCopy} hover={{ animationType: 'background-transition' }}>
            Share
          </Button>
        </div>
      </div>

      <div className={MainArticleClassNames.MarkdownContainer}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{ code: CodeBlock }}
          children={markdown}
        />
      </div>
    </React.Fragment>
  );
}

export const MainArticle = memo<MainArticleProps>(
  wrapComponent([ThemeContextProvider], MainArticleComponent)
);
