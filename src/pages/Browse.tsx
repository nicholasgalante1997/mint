import React, { memo } from 'react';
import { RoughNotationGroup } from 'react-rough-notation';
import { Heading, Body, Button } from 'heller-2-react';
import { colorBaseBluePrimary } from 'heller-2-lite';

import { Conditional, Header, Notation, Card } from '@/components';
import { ThemeContextProvider } from '@/contexts';
import { buildLocalHrefFromArticleFilePath, wrapComponent, getExecutionEnv } from '@/lib';
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

  const blackthornArticle = requestArticle(ArticleKeys.ESM_BROADCAST_CHANNEL_IMPORT_MAPS);
  const patternsTryArticle = requestArticle(ArticleKeys.PATTERNS_TRY);
  const lazyLoadHtmlMedia = requestArticle(ArticleKeys.LAZYLOADING_HTML_MEDIA);
  const signalsArticle = requestArticle(ArticleKeys.TC39_SIGNALS);
  const prefetchArticle = requestArticle(ArticleKeys.PREFETCH_WEBWORKERS_REACT);

  return (
    <React.Fragment>
      <Header />
      <div className={BrowsePageClassNames.Container}>
        <div className={BrowsePageClassNames.CardGridContainer}>
          <div className={BrowsePageClassNames.CardWrappingGrid}>
            <Conditional condition={Boolean(blackthornArticle)}>
              <div className={BrowsePageClassNames.BigCardContainer}>
                <img src={blackthornArticle?.display.image} alt="Doodles NFT" />
                <RoughNotationGroup show={true}>
                  <Notation color={colorBaseBluePrimary} length={65}>
                    <a
                      target="_self"
                      href={buildLocalHrefFromArticleFilePath(blackthornArticle?.contentPath || '#')}
                    >
                      <Heading as="h3">{blackthornArticle?.display?.title}</Heading>
                    </a>
                  </Notation>
                </RoughNotationGroup>
                <Body as="p" bold>
                  {blackthornArticle?.display?.subtitle}
                </Body>
                <a
                  className="button-link-wrapper"
                  target="_self"
                  href={buildLocalHrefFromArticleFilePath(blackthornArticle?.contentPath || '#')}
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
                title={lazyLoadHtmlMedia?.display.title || ''}
                description={lazyLoadHtmlMedia?.display.subtitle || ''}
                cta={{
                  text: 'Read Post',
                  href: buildLocalHrefFromArticleFilePath(lazyLoadHtmlMedia?.contentPath || '#')
                }}
              />
              <Card
                size="sm"
                type="mini"
                title={signalsArticle?.display.title || ''}
                description={signalsArticle?.display.subtitle || ''}
                cta={{
                  text: 'Read Post',
                  href: buildLocalHrefFromArticleFilePath(signalsArticle?.contentPath || '#')
                }}
              />
              <Card
                size="sm"
                type="mini"
                title={prefetchArticle?.display.title || ''}
                description={prefetchArticle?.display.subtitle || ''}
                cta={{
                  text: 'Read Post',
                  href: buildLocalHrefFromArticleFilePath(prefetchArticle?.contentPath || '#')
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export const Browse = memo(wrapComponent([ThemeContextProvider], BrowsePage));
