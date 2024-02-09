import React, { memo } from 'react';
import { RoughNotationGroup } from 'react-rough-notation';
import { Heading, Body, Button } from 'heller-2-react';
import { colorBaseBluePrimary } from 'heller-2-lite';

import { Conditional, Header, Notation, Card } from '@/components';
import { ThemeContextProvider } from '@/contexts';
import { buildLocalHrefFromArticleFilePath, wrapComponent } from '@/lib';
import { useBrowsePageStore } from '@/store';

import { BrowsePageClassNames } from './BrowseMeta';

function BrowsePage() {
  const { requestArticle } = useBrowsePageStore();

  const articleDataOne = requestArticle('@mint/how-to/prefetch-in-react.md');
  const articleDataTwo = requestArticle('@mint/how-to/get-observability-into-web-app-performance');
  const articleDataThree = requestArticle('@mint/patterns/predictable-try-in-javascript');
  const articleDataFour = requestArticle('@mint/how-to/react-server-side-rendering-with-no-framework');
  const articleDataFive = requestArticle('@mint/how-to/react-static-site-generation-with-no-framework');

  return (
    <React.Fragment>
      <Header />
      <div className={BrowsePageClassNames.Container}>
        <div className={BrowsePageClassNames.CardGridContainer}>
          <div className={BrowsePageClassNames.CardWrappingGrid}>
            <Conditional condition={Boolean(articleDataOne)}>
              <div className={BrowsePageClassNames.BigCardContainer}>
                <img src="https://coincu.com/wp-content/uploads/2022/07/111.png" alt="Doodles NFT" />
                <RoughNotationGroup show={true}>
                  <Notation color={colorBaseBluePrimary} length={65}>
                    <a
                      target="_self"
                      href={buildLocalHrefFromArticleFilePath(articleDataOne?.contentPath || '#')}
                    >
                      <Heading as="h3">{articleDataOne?.display.title}</Heading>
                    </a>
                  </Notation>
                </RoughNotationGroup>
                <Body as="p" bold>
                  {articleDataOne?.display.subtitle}
                </Body>
                <Button
                  hover={{ animationType: 'background-transition' }}
                  style={{ marginTop: '16px' }}
                  size="small"
                  rounded
                >
                  Read
                </Button>
              </div>
            </Conditional>
            <div style={{ flexDirection: 'column' }}>
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
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export const Browse = memo(wrapComponent([ThemeContextProvider], BrowsePage));
