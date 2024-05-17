import React, { memo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Body, Button, Heading } from 'heller-2-react';

import { Layout, CodeBlock, Summary, Conditional } from '@/components';

export interface MainArticleProps {
  public: {
    title: string;
    subtitle: string;
    image: {
      src: string;
      alt: string;
    };
    publishing: {
      date: string;
      collection: string;
    };
    markdown: string;
  };
}

const MainArticleClassNames = {
  ImageContainer: 'couch-mint__main-article-image-container',
  MetadataRow: 'couch-mint__main-article-metadata-row',
  Author: 'couch-mint__main-article-metadata-author couch-gag__highrise-bold',
  Collection: 'couch-mint__main-article-metadata-collection',
  Date: 'couch-mint__main-article-metadata-date',
  ShareButton: 'couch-mint__main-article-share-action',
  MarkdownContainer: 'couch-mint__main-article-markdown-container',
  Title: 'couch-mint__main-article-title couch-mint__ls',
  Subtitle: 'couch-mint__main-article-subtitle'
} as const;

const published = ['REACT-COMPILER_1'];

function getPublishStatus() {
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    for (const pub of published) {
      if (pathname.indexOf(pub) !== -1) return true;
    }
  }
  return false;
}

function MainArticleComponent({
  public: { markdown, publishing, image, subtitle, title }
}: MainArticleProps) {

  async function onCopy() {
    if (typeof window !== 'undefined') {
      window.navigator && (await window.navigator.clipboard.writeText(window.location.href));
    }
  }

  const isPublished = getPublishStatus()

  return (
    <Layout>
      <div className={MainArticleClassNames.ImageContainer}>
        <img alt={image.alt} src={image.src} height="100%" width="100%" loading="eager" />
      </div>

      <Heading className={MainArticleClassNames.Title} as="h1">
        {title}
      </Heading>

      <Summary content={subtitle} />

      <div className={MainArticleClassNames.MetadataRow}>
        <div>
          <Body as="span" className={MainArticleClassNames.Author}>
            by Nick Galante
          </Body>
          <Body as="span" className={MainArticleClassNames.Date}>
            {publishing.date}
          </Body>
        </div>
        <div>
          <Button
            size="small"
            rounded
            onClick={onCopy}
            hover={{ animationType: 'background-transition' }}
          >
            Share
          </Button>
        </div>
      </div>

      <Conditional condition={isPublished}>
        <div className={MainArticleClassNames.MarkdownContainer}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{ code: CodeBlock }}
            children={markdown}
          />
        </div>
      </Conditional>

      <Conditional condition={!isPublished}>
        <p>Post coming soon.</p>
      </Conditional>
    </Layout>
  );
}

export const MainArticle = memo<MainArticleProps>(MainArticleComponent);
