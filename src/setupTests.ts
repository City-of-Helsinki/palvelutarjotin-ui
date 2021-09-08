import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import './tests/initI18n';

import { server } from './tests/msw/server';

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
