import { createServer } from 'http';
import httpProxy from 'http-proxy';

import { EXPRESS_INSTANCE_COUNT, PORT } from './config.mjs';

let currentServer = 0;

const proxy = httpProxy.createProxyServer();
const loadBalancer = createServer(function (req, res) {
  const target = `http://localhost:${parseInt(PORT) + currentServer}`;
  currentServer = (currentServer + 1) % EXPRESS_INSTANCE_COUNT;
  proxy.web(req, res, { target });
});

export { loadBalancer };
