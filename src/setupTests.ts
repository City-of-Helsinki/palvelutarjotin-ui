import '@testing-library/jest-dom';
import './tests/initI18n';

import { publicRuntimeConfig } from '../next.config';

jest.mock('next/config', () => {
  return () => ({
    publicRuntimeConfig: {
      localeSubpaths: publicRuntimeConfig.localeSubpaths,
    },
  });
});
