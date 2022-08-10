/* eslint-disable */
import { sleep } from 'k6';
import http from 'k6/http';

export const options = {
  duration: '10m',
  vus: 5, // Staging headless cms is a bottle neck. It seems to slow down very fast when load increase
  //  vus: 1,
  thresholds: {
    //avg is around ?800ms? on https://palvelutarjotin.test.kuva.hel.ninja
    http_req_duration: ['p(95)<5000'],
  },
};

export default () => {
  const res = http.get('https://palvelutarjotin.test.kuva.hel.ninja/fi');
  //10 loads per minute
  sleep(6);
};
