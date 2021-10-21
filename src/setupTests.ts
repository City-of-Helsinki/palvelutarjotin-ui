import '@testing-library/jest-dom';
import dotenv from 'dotenv';
import { toHaveNoViolations } from 'jest-axe';
import './tests/initI18n';

import { server } from './tests/msw/server';

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

jest.mock('next/config', () => {
  return () => ({});
});

jest.setTimeout(10000);
