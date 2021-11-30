import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
  vus: 500,
  duration: '5s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(90)<500', 'avg<2000'], // 95% of requests should be below 200ms
  },
};

let id=61590;


export default function () {
  group(`Establishing benchmark connection at ${options.vus}VUs`, () => {
    let benchmarkURL = 'http://3.144.198.155/reviews/benchmark';
    let res = http.get(benchmarkURL);
    check(res, {
      'is status 200': r => r.status === 200,
      'is not status 400': r => r.status < 400,
      'transaction time < 100ms': r => r.timings.duration < 100,
      'transaction time < 200ms': r => r.timings.duration < 200,
      'response includes "Hello World"': r => r.json()[0]['?column?'].includes('Hello World'),
    });
    sleep(0.2);
  })

  group('Testing /reviews/meta endpoint', () => {
    let metaURL = `http://3.144.198.155/reviews/meta/?product_id=${id}`;
    let res = http.get(metaURL);
    check(res, {
      'is status 200': r => r.status === 200,
      'is not status 400': r => r.status < 400,
      'transaction time = 0': r => r.timings.duration = 0,
      'transaction time < 10ms': r => r.timings.duration < 10,
      'transaction time < 20ms': r => r.timings.duration < 20,
      'transaction time < 50ms': r => r.timings.duration < 50,
      'transaction time < 100ms': r => r.timings.duration < 100,
      'response includes characteristics object': r => typeof r.json().characteristics === 'object',
    });
    sleep(0.2);
  })

  group('Testing LOCAL /reviews/ endpoint', () => {
    let URL = `http://3.144.198.155/reviews/?product_id=${id}&limit=1`;
    let res = http.get(URL);
    check(res, {
      'is status 200': r => r.status === 200,
      'is not status 400': r => r.status < 400,
      'transaction time = 0': r => r.timings.duration = 0,
      'transaction time < 20ms': r => r.timings.duration < 20,
      'transaction time < 50ms': r => r.timings.duration < 50,
      'transaction time < 100ms': r => r.timings.duration < 100,
      'transaction time < 200ms': r => r.timings.duration < 200,
      'transaction time < 500ms': r => r.timings.duration < 500,
      'transaction time < 1s': r => r.timings.duration < 1000,
      'transaction time < 1.5s': r => r.timings.duration < 1500,
      'transaction time < 2s': r => r.timings.duration < 2000,
      'response.product_id matches': r => r.json().product === String(id)
    });
    sleep(0.2);
  });
};