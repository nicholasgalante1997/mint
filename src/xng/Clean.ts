import { rm } from 'node:fs/promises';
import { logger } from './Logger';
import { DIST } from './Paths';

export async function cleanUpOnFailure(e: unknown) {
  logger.error(e);
  logger.error('Cleaning build/web contents on failure...');
  await rm(DIST);
}
