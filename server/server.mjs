import { createServer } from 'http';
import express from 'express';

import { setupMiddleware } from './middleware.mjs';
import { setupErrorHandler } from './errorHandler.mjs';

const app = express();

setupMiddleware(app);
setupErrorHandler(app);

function getServer() {
  return createServer(app);
}

export { getServer };
