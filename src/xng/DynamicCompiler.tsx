import React from 'react';
import { renderToString } from 'react-dom/server';
import { Attempt, Option } from 'sleepydogs';

import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

import AppConfig from '../../config/app.json';

import { PageIndex, PageIndexKey } from '@/pages';

import { ERROR_CODES } from './ErrorCodes';
import { inject } from './Inject';
import { logger } from './Logger';
import { MainArticleProps } from '@/pages/Post';
import { getHtmlTemplate } from './Template';
import { DIST } from './Paths';
import { cleanUpOnFailure } from './Clean';
import StopWatch from './StopWatch';

export async function buildDynamicAssets() {
  logger.info(`[xng](dynamic) 🚀`);

  const stopWatch = new StopWatch();
  stopWatch.start();

  const promises: Array<Promise<void>> = [];
  AppConfig.data.articles.forEach(async function (article) {
    const { contentPath, display, key } = article;
    const {
      data: Component,
      state,
      error
    } = new Option(() => PageIndex.get(PageIndexKey.MainArticle)).resolveSync();

    if (state === 'rejected' || error || typeof Component === 'undefined' || Component === null) {
      logger.error(ERROR_CODES.DYNAMIC_ASSETS.PAGE_INDEXING_EXCEPTION[1]);
      logger.error({ error });
      process.exit(ERROR_CODES.DYNAMIC_ASSETS.PAGE_INDEXING_EXCEPTION[0]);
    }

    const template = await getHtmlTemplate();
    const md = await getMarkdown(contentPath);
    const props = buildProps(display, md);
    const filename = getOutfileName(key);
    const bundle = 'article';
    const markup = renderToString(<Component {...props} />);
    const fileContent = inject(template.substring(0), markup, bundle, props);
    const outfilePath = path.resolve(DIST, filename + '.html');

    const $writeAttempt = new Attempt(async () => {
      await writeFile(outfilePath, fileContent, { encoding: 'utf8' });
    });
    promises.push($writeAttempt.run());
  });

  await Promise.all(promises).catch(cleanUpOnFailure);

  stopWatch.stop();

  logger.info(`[xng](dynamic) ✅`);
  logger.info(`[xng](dynamic) duration: ${stopWatch.elapsed('s')}`);
}

async function getMarkdown(contentPath: string) {
  const markdownPath = path.resolve(process.cwd(), ...contentPath.split('/'));
  const $markdownOption = new Option(async () => await readFile(markdownPath, { encoding: 'utf8' }));
  const { data: markdownFile, error, state } = await $markdownOption.resolve();
  if (state === 'rejected' || error || !markdownFile || markdownFile === '') {
    logger.error(ERROR_CODES.DYNAMIC_ASSETS.READ_MARKDOWN_FILE_EXCEPTION[1]);
    if (error) logger.error(error);
    process.exit(ERROR_CODES.DYNAMIC_ASSETS.READ_MARKDOWN_FILE_EXCEPTION[0]);
  }

  return markdownFile;
}

function buildProps(
  display: (typeof AppConfig)['data']['articles'][number]['display'],
  markdown: string
): MainArticleProps {
  return {
    public: {
      title: display.title,
      subtitle: display.subtitle,
      image: {
        alt: display.imageAltText,
        src: display.image
      },
      publishing: {
        date: getDate(display.date || ''),
        collection: display.tags.map(({ keys }) => keys).join(', ')
      },
      markdown
    }
  };
}

function getOutfileName(key: string) {
  return key.split('.')[0].replace(/\//g, '-').replace('@mint-', '');
}

function getDate(date: string) {
  if (date === '') return '';
  return new Intl.DateTimeFormat(['en-US']).format(new Date(date));
}
