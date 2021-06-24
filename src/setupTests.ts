import '@testing-library/jest-dom';
import './tests/initI18n';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

jest.mock('next/config', () => {
  return () => ({});
});
