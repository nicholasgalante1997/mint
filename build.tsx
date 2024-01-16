import fs from 'fs';
import path from 'path';

import React from 'react';
import { renderToString } from 'react-dom/server';

import AppConfig from './config/app.json';
import { PageIndex, PageIndexKey } from './src/pages';
import { MainArticleProps } from './src/pages/article/main/types';

const outDir = path.resolve(process.cwd(), 'build', 'web');
const bundleMarker = '<!-- @couch-mint/bundle-entrypoint -->';
const reactAppMarker = '<!-- @couch-mint/react-entrypoint -->';
const propMarker = '<!-- @couch-mint/props-injection-point -->';

/**
 * What does this build script do?
 *
 * > Our application's entire configuration is derived from the json blob provided in config/app.json
 */

try {
  /**
   * 1. Load the template html file
   */
  const htmlTemplateAsString = fs.readFileSync(path.resolve(process.cwd(), 'html', 'index.html'), {
    encoding: 'utf-8'
  });

  /**
   * 2. Iterate through each entrypoint in our appConfig.
   * Each entrypoint can be a configuration for
   * - a javascript bundle
   * - a statically prepared html file
   * - or both
   */
  for (const entrypoint of AppConfig.entrypoints) {
    /** 2.1 Destructure necessary properties off entrypoint */
    const {
      page: {
        registryKey
      } /** the `registryKey` is used to index the PageIndex map of Page Level Components */,
      out: { bundle, html } /** Used to drive the output of the build operation */
    } = entrypoint;

    /**
     * This build script is only concerned with static html file generation,
     * there is a webpack configuration that iterates through AppConfig.entrypoints
     * and generates the client side javascript bundles that are injected into
     * these statically generated markup files,
     * so if a given entrypoint does not have an html field
     * we can skip generating its server side markup (as it may not have one)
     */

    /** 2.2 If we need to generate a static html file */
    if (bundle && html) {
      /** Request a Page Component from our registry using the provided registry key, destructured off of entrypoint */
      const Component = PageIndex.get(registryKey as PageIndexKey);
      /** If no component exists, throw an error */
      if (!Component) {
        throw new Error('PageIndexReturnedNullException');
      }
      /** Render the Page Component to a markup string */
      const componentAsString = renderToString(<Component />);
      /** Clone the html template so we don't mutate the original string */
      let copyOfHtmlTemplate = htmlTemplateAsString.slice();
      /** Inject our react app, and a script tag bootstrapping our react app on the client */
      copyOfHtmlTemplate = copyOfHtmlTemplate
        .replace(reactAppMarker, componentAsString)
        .replace(bundleMarker, `<script src="${bundle}.bundle.js" defer></script>`);

      /** Write out our static markup file with our injected React App Markup + Client Side Script */
      fs.writeFileSync(path.resolve(outDir, `${html}.html`), copyOfHtmlTemplate, { encoding: 'utf-8' });
    }
  }

  /**
   * 3. Build all of our dynamic article pages into static markup
   */
  for (const article of AppConfig.data.articles) {
    const { contentPath, display, key } = article;

    const Component = PageIndex.get(PageIndexKey.MainArticle);

    if (!Component) {
      throw new Error('PageIndexReturnedNullException');
    }

    const markdownFile = fs.readFileSync(path.resolve(process.cwd(), ...contentPath.split('/')), {
      encoding: 'utf-8'
    });
    if (!markdownFile || markdownFile === '') {
      throw new Error('MarkdownFileCorruptionException:::' + key);
    }
    const props: MainArticleProps = {
      public: {
        title: display.title,
        subtitle: display.subtitle,
        image: {
          alt: 'Doodles nft, against a pink background',
          src: 'https://coincu.com/wp-content/uploads/2022/07/111.png'
        },
        publishing: {
          date: 'Add date when article in final state',
          collection: display.tags.map(({ keys }) => keys).join(', ')
        },
        markdown: markdownFile
      }
    };
    const htmlFileName = key.split('.')[0].replace(/\//g, '-').replace('@mint-', '');
    const componentAsString = renderToString(<Component {...props} />);
    let copyOfHtmlTemplate = htmlTemplateAsString.slice();
    copyOfHtmlTemplate = copyOfHtmlTemplate
      .replace(reactAppMarker, componentAsString)
      .replace(bundleMarker, `<script src="article.bundle.js" defer></script>`)
      .replace(
        propMarker,
        `<script id="@couch-gag/mint__props-node" type="application/json">${JSON.stringify(
          props
        )}</script>`
      );

    fs.writeFileSync(path.resolve(outDir, htmlFileName) + '.html', copyOfHtmlTemplate, {
      encoding: 'utf-8'
    });
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}
