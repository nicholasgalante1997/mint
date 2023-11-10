import fs from 'fs';
import path from 'path';

import React from 'react';
import { renderToString } from 'react-dom/server';

import AppConfig from './config/app.json';
import { PageIndex, PageIndexKey } from './src/pages';

const outDir = path.resolve(process.cwd(), 'build');
const bundleMarker = '<!-- @couch-mint/bundle-entrypoint -->';
const reactAppMarker = '<!-- @couch-mint/react-entrypoint -->';
const seoMarker = '<!-- @couch-mint/seo-additional-metadata -->';

try {
  const htmlTemplateAsString = fs.readFileSync(path.resolve(process.cwd(), 'html', 'index.html'), {
    encoding: 'utf-8'
  });
  for (const entrypoint of AppConfig.entrypoints) {
    const {
      page: { registryKey },
      out: { bundle, html }
    } = entrypoint;

    const Component = PageIndex.get(registryKey as PageIndexKey);

    if (!Component) {
      throw new Error('PageIndexReturnedNullException');
    }

    const componentAsString = renderToString(<Component />);

    let copyOfHtmlTemplate = htmlTemplateAsString.slice();

    copyOfHtmlTemplate = copyOfHtmlTemplate
      .replace(reactAppMarker, componentAsString)
      .replace(bundleMarker, `<script src="${bundle}.bundle.js" defer></script>`);

    fs.writeFileSync(path.resolve(outDir, `${html}.html`), copyOfHtmlTemplate, { encoding: 'utf-8' });
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}
