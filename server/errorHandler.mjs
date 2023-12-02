function errHandler(err, req, res, next) {
  res.status(500).send('<p>' + JSON.stringify(err) + '</p>');
  return;
}

function setupErrorHandler(app) {
  app.use(errHandler);
  return app;
}

export { setupErrorHandler };
