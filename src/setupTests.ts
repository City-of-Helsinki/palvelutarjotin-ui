import '@testing-library/jest-dom';
import './tests/initI18n';
import { toHaveNoViolations } from 'jest-axe';

import { publicRuntimeConfig } from '../next.config';

expect.extend(toHaveNoViolations);

jest.mock('next/config', () => {
  return () => ({
    publicRuntimeConfig: {
      localeSubpaths: publicRuntimeConfig.localeSubpaths,
    },
  });
});
