import express from 'express';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';

import nextI18next from './i18n.ts';

const port = process.env.PORT || 3000;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

const RESPONSES = {
  OK: 'OK',
  SERVER_IS_NOT_READY: 'SERVER_IS_NOT_READY',
};

let serverIsReady = false;

const signalReady = () => {
  serverIsReady = true;
};

const checkIsServerReady = (response) => {
  if (serverIsReady) {
    response.send(RESPONSES.OK);
  } else {
    response.status(500).send(RESPONSES.SERVER_IS_NOT_READY);
  }
};

(async () => {
  await app.prepare();
  const server = express();

  await nextI18next.initPromise;

  server.use(nextI18NextMiddleware(nextI18next));

  server.get('/healthz', (req, res) => {
    checkIsServerReady(res);
  });

  server.get('/readiness', (req, res) => {
    checkIsServerReady(res);
  });

  server.get('*', (req, res) => handle(req, res));

  await server.listen(port);
  signalReady();
  console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line no-console
})();
