import pino from 'pino';

const logger = pino({
  name: '@mint-web-server',
  level: process.env.LOG_LEVEL || 'info',
  base: undefined,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

export { logger };
