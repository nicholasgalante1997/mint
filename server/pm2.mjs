import path from 'path';
import pm2 from 'pm2';
import { logger } from './pino.mjs';

const PM2_INSTANCE_COUNT = process.env.PM2_INSTANCE_COUNT || 4;
const PM2_EXITED_ERROR =
  'A fatal error was encountered that caused pm2 to stop. Attempting to restart...';

const SCRIPT_PATH = path.resolve(process.cwd(), 'server', 'index.mjs');

pm2.connect((error) => {
  if (error) {
    logger.fatal(PM2_EXITED_ERROR);
    logger.fatal(error);
    process.exit(2);
  }

  pm2.start(
    {
      script: SCRIPT_PATH,
      autorestart: true,
      instances: PM2_INSTANCE_COUNT,
      exec_mode: 'cluster',
      name: '@mint__pm2-web-server'
    },
    (appInitErr) => {
      if (appInitErr) {
        logger.fatal(PM2_EXITED_ERROR);
        logger.fatal(error);
        process.exit(2);
      }

      logger.info(
        `@mint/pm2-web-server process manager started in cluster mode with ${PM2_INSTANCE_COUNT} instances and auto-restart on failure`
      );

      /**
       * If we disconnect from pm2,
       * the contsiner exits as a looping process.
       * 
       * We could loop possibly, to avoid exiting the container 
       * but also close the connection 
       */
      /** pm2.disconnect(); */
    }
  );
});
