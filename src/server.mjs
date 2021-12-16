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

  // NOTE: Allow only POST for newsletter, because of security conserns.
  // (Other options are GET and DELETE).
  // We don't want that people can unsubsribe other people from the newsletters.
  server
    .route('/api/newsletter/subscribe/:groupId')
    .post((req, res) => handle(req, res))
    .get((req, res) => res.status(403).end());

  // Allow all GETs to everywhere, except to the ones reject before this
  server.get('*', (req, res) => handle(req, res));

  await server.listen(port);
  signalReady();
  console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line no-console
})();
