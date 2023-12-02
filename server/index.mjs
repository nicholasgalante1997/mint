import { PORT } from './config.mjs';
import { logger } from './pino.mjs';
import { getServer } from './server.mjs';

void (() => {
  getServer().listen(PORT, logger.info(`WebServer process started on ${PORT}`));
})();
