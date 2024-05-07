import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { Option } from 'sleepydogs';

import { ERROR_CODES } from './ErrorCodes';
import { logger } from './Logger';

let htmlTemplate: string | null = null;

export async function getHtmlTemplate() {
  if (!htmlTemplate) {
    const htmlFilePath = path.resolve(process.cwd(), 'html', 'index.html');
    const readHtmlOption = new Option(async () => await readFile(htmlFilePath, { encoding: 'utf-8' }));
    await readHtmlOption.match(
      ({ data }) => (htmlTemplate = data),
      (err) => {
        logger.error(err);
        logger.error(ERROR_CODES.HTML.READFILE_EXCEPTION[1]);
        process.exit(ERROR_CODES.HTML.READFILE_EXCEPTION[0]);
      }
    );

    return htmlTemplate!;
  }

  return htmlTemplate;
}
