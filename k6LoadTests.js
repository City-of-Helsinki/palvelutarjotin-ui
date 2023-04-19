/* eslint-disable */
import { sleep } from 'k6';
import http from 'k6/http';

export const options = {
  duration: '10m',
  vus: 5, // Staging headless cms is a bottle neck. It seems to slow down very fast when load increase
  //  vus: 1,
  thresholds: {
    http_req_duration: ['p(95)<5000'],  // average was ~800ms at some point in the past
  },
};

export default () => {
  const res = http.get('https://kultus-ui.test.hel.ninja/fi');
  //10 loads per minute
  sleep(6);
};
