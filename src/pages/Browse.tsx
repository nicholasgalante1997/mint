import React, { memo } from 'react';
import { Heading, Body, Button } from 'heller-2-react';

import { Conditional, Layout, Card } from '@/components';
import { buildLocalHrefFromArticleFilePath } from '@/lib';
import { useBrowsePageStore } from '@/store';
import { ArticleKeys } from '@/types';

export const BrowsePageClassNames = {
  Container: 'couch-mint__browse-page-container',
  CardGridContainer: 'couch-mint__card-container',
  ActionContainer: 'couch-mint__card-action-container',
  SearchContainer: 'couch-mint__card-search-container',
  ButtonChipRow: 'couch-mint__card-button-chip-row',
  CardWrappingGrid: 'couch-mint__card-wrapping-container',
  CardAsideColumn: 'couch-mint__card-aside-container',
  PaginationContainer: 'couch-mint__card-pagination-container',
  BigCardContainer: 'couch-mint__big-card-container',
  MiniCardContainer: 'couch-mint__mini-card-container'
} as const;

function BrowsePage() {
  const { requestArticle } = useBrowsePageStore();

  const reactCompilerArticle = requestArticle(ArticleKeys.REACT_COMPILER_1);
  const patternsTryArticle = requestArticle(ArticleKeys.PATTERNS_TRY);
  const esmBcMapsArticle = requestArticle(ArticleKeys.ESM_BROADCAST_CHANNEL_IMPORT_MAPS);

  return (
    <Layout>
      <div className={BrowsePageClassNames.Container}>
        <div className={BrowsePageClassNames.CardGridContainer}>
          <div className={BrowsePageClassNames.CardWrappingGrid}>
            <Conditional condition={Boolean(reactCompilerArticle)}>
              <div className={BrowsePageClassNames.BigCardContainer}>
                <img src={reactCompilerArticle?.display.image} alt="Doodles NFT" />
                  <a
                    target="_self"
                    href={buildLocalHrefFromArticleFilePath(reactCompilerArticle?.contentPath || '#')}
                  >
                    <Heading as="h3">{reactCompilerArticle?.display?.title}</Heading>
                  </a>
                <Body as="p" bold>
                  {reactCompilerArticle?.display?.subtitle}
                </Body>
                <a
                  className="button-link-wrapper"
                  target="_self"
                  href={buildLocalHrefFromArticleFilePath(reactCompilerArticle?.contentPath || '#')}
                >
                  <Button
                    hover={{ animationType: 'background-transition' }}
                    style={{ marginTop: '16px' }}
                    size="small"
                    rounded
                  >
                    Read
                  </Button>
                </a>
              </div>
            </Conditional>
            <div className={BrowsePageClassNames.MiniCardContainer}>
              <Card
                size="sm"
                type="mini"
                title={patternsTryArticle?.display.title || ''}
                description={patternsTryArticle?.display.subtitle || ''}
                cta={{
                  text: 'Read Post',
                  href: buildLocalHrefFromArticleFilePath(patternsTryArticle?.contentPath || '#')
                }}
              />
              <Card
                size="sm"
                type="mini"
                title={esmBcMapsArticle?.display.title || ''}
                description={esmBcMapsArticle?.display.subtitle || ''}
                cta={{
                  text: 'Read Post',
                  href: buildLocalHrefFromArticleFilePath(esmBcMapsArticle?.contentPath || '#')
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const Browse = memo(BrowsePage);
