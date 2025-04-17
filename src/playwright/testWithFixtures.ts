// Disable linter rule that erroneously thinks Playwright's use function is a React hook:
/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test';

import { AccessibilityStatementCmsPage } from './pages/accessibilityStatementCms.page';
import { CmsPage } from './pages/cms.page';
import { FrontPage } from './pages/front.page';
import { SearchPage } from './pages/search.page';

type TestFixtures = {
  // Base fixtures
  frontPage: FrontPage;
  cmsPage: CmsPage;
  accessibilityStatementCmsPage: AccessibilityStatementCmsPage;
  searchPage: SearchPage;
  // Parametrized versions of base fixtures
  defaultFrontPage: FrontPage;
  fiFrontPage: FrontPage;
  svFrontPage: FrontPage;
  enFrontPage: FrontPage;
};

export const test = base.extend<TestFixtures>({
  frontPage: async ({ page }, use) => {
    await use(new FrontPage(page));
  },

  cmsPage: async ({ page }, use) => {
    await use(new CmsPage(page));
  },

  accessibilityStatementCmsPage: async ({ page }, use) => {
    await use(new AccessibilityStatementCmsPage(page));
  },

  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },

  defaultFrontPage: async ({ page }, use) => {
    await use(await FrontPage.create(page, '/'));
  },

  fiFrontPage: async ({ page }, use) => {
    await use(await FrontPage.create(page, '/fi'));
  },

  svFrontPage: async ({ page }, use) => {
    await use(await FrontPage.create(page, '/sv'));
  },

  enFrontPage: async ({ page }, use) => {
    await use(await FrontPage.create(page, '/en'));
  },
});

export { expect } from '@playwright/test';
