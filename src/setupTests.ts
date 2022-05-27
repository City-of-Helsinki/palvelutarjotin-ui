import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

import dotenv from 'dotenv';
import { toHaveNoViolations } from 'jest-axe';
import './tests/initI18n';
import 'jest-localstorage-mock';

import { server } from './tests/msw/server';

// To avoid error: ReferenceError: TextEncoder is not defined
// discussed here: https://github.com/jsdom/jsdom/issues/2524
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;

dotenv.config({ path: '.env' });

expect.extend(toHaveNoViolations);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

beforeEach(() => {
  localStorage.clear();
});

jest.mock('next/config', () => {
  return () => ({});
});

jest.setTimeout(50000);
