import React, { memo } from 'react';
import { RoughNotationGroup } from 'react-rough-notation';
import { Heading, Body, Button } from 'heller-2-react';
import { colorBaseBluePrimary } from 'heller-2-lite';

import { Conditional, Header, Notation, Card } from '@/components';
import { ThemeContextProvider } from '@/contexts';
import { buildLocalHrefFromArticleFilePath, wrapComponent, getExecutionEnv } from '@/lib';
import { useBrowsePageStore } from '@/store';

import { BrowsePageClassNames } from './BrowseMeta';

function BrowsePage() {
  const { requestArticle } = useBrowsePageStore();

  const blackthornArticle = requestArticle('@mint/ESM_BROADCAST_CHANNEL_1');

  function handleNavigationToArticlePage(article: ReturnType<typeof requestArticle>) {
    if (getExecutionEnv() === "browser" && typeof article !== "undefined") {
      window.location.assign(buildLocalHrefFromArticleFilePath(article.contentPath))
    }
  }

  return (
    <React.Fragment>
      <Header />
      <div className={BrowsePageClassNames.Container}>
        <div className={BrowsePageClassNames.CardGridContainer}>
          <div className={BrowsePageClassNames.CardWrappingGrid}>
            <Conditional condition={Boolean(blackthornArticle)}>
              <div onClick={() => handleNavigationToArticlePage(blackthornArticle)} className={BrowsePageClassNames.BigCardContainer}>
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
                <Button
                  onClick={() => handleNavigationToArticlePage(blackthornArticle)}
                  hover={{ animationType: 'background-transition' }}
                  style={{ marginTop: '16px' }}
                  size="small"
                  rounded
                >
                  Read
                </Button>
              </div>
            </Conditional>
            {/* <div style={{ flexDirection: 'column' }}>
              <Card
                size="sm"
                type="mini"
                title={articleDataTwo?.display.title || ''}
                description={articleDataTwo?.display.subtitle || ''}
                cta={{
                  text: 'Read',
                  href: buildLocalHrefFromArticleFilePath(articleDataTwo?.contentPath || '#')
                }}
              />
              <Card
                size="sm"
                type="mini"
                title={articleDataThree?.display.title || ''}
                description={articleDataThree?.display.subtitle || ''}
                cta={{
                  text: 'Read',
                  href: buildLocalHrefFromArticleFilePath(articleDataThree?.contentPath || '#')
                }}
              />
              <Card
                size="sm"
                type="mini"
                title={articleDataFour?.display.title || ''}
                description={articleDataFour?.display.subtitle || ''}
                cta={{
                  text: 'Read',
                  href: buildLocalHrefFromArticleFilePath(articleDataFour?.contentPath || '#')
                }}
              />
            </div>
            <div style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
              <Card
                size="lg"
                type="full"
                title={articleDataFive?.display.title || ''}
                description={articleDataFive?.display.subtitle || ''}
                cta={{
                  text: 'Read',
                  href: buildLocalHrefFromArticleFilePath(articleDataFive?.contentPath || '#')
                }}
                image="https://coincu.com/wp-content/uploads/2022/07/111.png"
                alt="Doodles NFT"
              />
            </div> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export const Browse = memo(wrapComponent([ThemeContextProvider], BrowsePage));
