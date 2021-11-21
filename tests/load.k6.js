import http from 'k6/http';
import { sleep, check } from 'k6';
import {describe} from 'jest';

export const options = {
  vus: 100,
  duration: '5s'
};

let benchmarkTestURL = 'http://localhost:3000/reviews/benchmark'
// let url = 'http://localhost:3000/reviews/?product_id=61588'

export default function () {
  const res = http.get(benchmarkTestURL)
  check(res, {
    'is status 200': r => r.status === 200,
    'transaction time < 20ms': r => r.timings.duration < 20,
    'transaction time < 30ms': r => r.timings.duration < 30,
    'transaction time < 50ms': r => r.timings.duration < 50,
    'transaction time < 60ms': r => r.timings.duration < 60,
    'transaction time < 70ms': r => r.timings.duration < 70,
    'transaction time < 80ms': r => r.timings.duration < 80,
    'transaction time < 100ms': r => r.timings.duration < 100,
    'transaction time < 200ms': r => r.timings.duration < 200
  });
  sleep(0.1);
}

// Mock a server ?
// Send queries with Jest, assert for information
//