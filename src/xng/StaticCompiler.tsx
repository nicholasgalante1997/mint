import React from 'react';
import { renderToString } from 'react-dom/server';
import { Attempt, Option } from 'sleepydogs';

import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import AppConfig from '../../config/app.json';

import { PageIndex, PageIndexKey } from '../pages';

import { cleanUpOnFailure } from './Clean';
import { ERROR_CODES } from './ErrorCodes';
import { inject } from './Inject';
import { logger } from './Logger';
import { DIST } from './Paths';
import StopWatch from './StopWatch';
import { getHtmlTemplate } from './Template';

export async function buildStaticAssets() {
  logger.info(`[xng](static) 🚀`);

  const stopWatch = new StopWatch();
  stopWatch.start();

  const promises: Array<Promise<void>> = [];

  AppConfig.entrypoints.forEach(async function (entrypoint) {
    if (isStaticAssetEntrypoint(entrypoint)) {
      const {
        data: Component,
        state,
        error
      } = new Option(() => PageIndex.get(entrypoint.page.registryKey as PageIndexKey)).resolveSync();
      if (state === 'rejected' || error || typeof Component === 'undefined' || Component === null) {
        logger.error(ERROR_CODES.STATIC_ASSETS.PAGE_INDEXING_EXCEPTION[1]);
        logger.error({ error });
        process.exit(ERROR_CODES.STATIC_ASSETS.PAGE_INDEXING_EXCEPTION[0]);
      }

      const markup = renderToString(<Component />);
      const template = await getHtmlTemplate();

      const outfile = inject(template.substring(0), markup, entrypoint.out.bundle);
      const outfilePath = path.resolve(DIST, `${entrypoint.out.html}.html`);
      const writeFileCallback = async () => {
        await writeFile(outfilePath, outfile, { encoding: 'utf-8' });
      };
      const $writeAttempt = new Attempt(writeFileCallback);

      promises.push($writeAttempt.run());
    }
  });

  await Promise.all(promises).catch(cleanUpOnFailure);

  stopWatch.stop();

  logger.info(`[xng](static) ✅`);
  logger.info(`[xng](static) duration: ${stopWatch.elapsed('s')}`);
}

function isStaticAssetEntrypoint(entrypoint: (typeof AppConfig)['entrypoints'][number]) {
  return !!entrypoint.out.bundle && !!entrypoint.out.html;
}
