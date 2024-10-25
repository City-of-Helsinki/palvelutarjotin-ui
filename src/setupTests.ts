import { TextEncoder, TextDecoder } from 'util';

import '@testing-library/jest-dom';

import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
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

// Load error messages for Apollo client so it's easier to debug errors
loadDevMessages();
loadErrorMessages();

// Mock the ICS create event that fails during the tests
jest.mock('ics', () => jest.fn());

// eslint-disable-next-line max-len
// https://stackoverflow.com/questions/67872622/jest-spyon-not-working-on-index-file-cannot-redefine-property/69951703#69951703
jest.mock('./generated/graphql', () => ({
  __esModule: true,
  ...jest.requireActual('./generated/graphql'),
}));

// eslint-disable-next-line max-len
// https://stackoverflow.com/questions/67872622/jest-spyon-not-working-on-index-file-cannot-redefine-property/69951703#69951703
jest.mock('./domain/enrolment/utils', () => ({
  __esModule: true,
  ...jest.requireActual('./domain/enrolment/utils'),
  getCAPTCHAToken: () => 'captcha-token',
}));

// To avoid error: TypeError: Cannot redefine property
// eslint-disable-next-line max-len
// disusssed here: https://stackoverflow.com/questions/67872622/jest-spyon-not-working-on-index-file-cannot-redefine-property
Object.defineProperty(exports, '__esModule', {
  value: true,
});

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
