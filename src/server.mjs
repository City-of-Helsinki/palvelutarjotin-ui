import express from 'express';
import next from 'next';
import React from 'react';

const port = process.env.PORT || 3000;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

// to avoid warning: "Warning: useLayoutEffect does nothing on the server"
React.useLayoutEffect = React.useEffect;

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

  server.get('/healthz', (req, res) => {
    checkIsServerReady(res);
  });

  server.get('/readiness', (req, res) => {
    checkIsServerReady(res);
  });

  server.get('*', (req, res) => handle(req, res));
  server.all('/api/newsletter/subscribe/:groupId', (req, res) =>
    handle(req, res)
  );

  await server.listen(port);
  signalReady();
  console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line no-console
})();
