import { buildStaticAssets } from './StaticCompiler';
import { buildDynamicAssets } from './DynamicCompiler';
import { logger } from './Logger';
import StopWatch from './StopWatch';

(async () => {
  logger.info(`[xng](main) 🚀`);

  const stopWatch = new StopWatch();
  stopWatch.start();

  await Promise.all([buildStaticAssets(), buildDynamicAssets()])
    .then((_) => {
      logger.info(`[xng](main) passed.`);
    })
    .catch((e) => {
      logger.error(`[xng](main) failed.`);
      logger.error(e);
      stopWatch.stop();
      process.exit(4);
    });

  stopWatch.stop();

  logger.info(`[xng](main) ✅`);
  logger.info(`[xng](main) duration: ${stopWatch.elapsed('s')}`);
})();
