import express from 'express';
import cors from 'cors';
import serveStatic from 'serve-static';
import path from 'path';

/**
 * @name setupMiddleware
 * @summary Adds cors() and serveStatic() middleware to argument express app.
 * @param {express.Express} app
 * @returns {express.Express}
 */
function setupMiddleware(app) {
  app.use(cors());
  app.use(
    serveStatic(path.resolve(process.cwd(), 'build', 'web'), {
      extensions: ['html', 'htm'],
      immutable: true,
      maxAge: '1d',
      lastModified: true,
      setHeaders
    })
  );
  return app;
}

function setHeaders(res, path, stat) {
  res.setHeader('Vary', 'Accept-Encoding');
  if (serveStatic.mime.lookup(path) === 'text/html') {
    // Custom Cache-Control for HTML files
    res.setHeader('Cache-Control', 'public, max-age=0');
  }
}

export { setupMiddleware };
