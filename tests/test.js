import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '5s'
};

let url = 'http://localhost:3000/reviews/benchmark'
// let url = 'http://localhost:3000/reviews/?product_id=61588'

export default function () {
  const res = http.get(url)
  check(res, {
    'is status 200': r => r.status === 200,
    'transaction time < 200ms': r => r.timings.duration < 200,
    'transaction time < 250ms': r => r.timings.duration < 250,
    'transaction time < 350ms': r => r.timings.duration < 350,
    'transaction time < 500ms': r => r.timings.duration < 500,
    'transaction time < 1000ms': r => r.timings.duration < 1000,
    'transaction time < 2000ms': r => r.timings.duration < 2000,
    'transaction time < 4000ms': r => r.timings.duration < 4000,
    'transaction time < 5000ms': r => r.timings.duration < 5000,
    'transaction time < 6000ms': r => r.timings.duration < 6000,
  });
  sleep(0.1);
}
