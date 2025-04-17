// Disable linter rule that erroneously thinks Playwright's use function is a React hook:
/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test';

import { AccessibilityStatementCmsPage } from './pages/accessibilityStatementCms.page';
import { FrontPage } from './pages/front.page';
import { SearchPage } from './pages/search.page';

type TestFixtures = {
  // Base fixtures
  accessibilityStatementCmsPage: AccessibilityStatementCmsPage;
  searchPage: SearchPage;
  // Parametrized versions of base fixtures
  frontPage: FrontPage;
  frontPageFi: FrontPage;
  frontPageSv: FrontPage;
  frontPageEn: FrontPage;
};

export const test = base.extend<TestFixtures>({
  accessibilityStatementCmsPage: async ({ page }, use) => {
    await use(new AccessibilityStatementCmsPage(page));
  },

  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },

  frontPage: async ({ page }, use) => {
    await use(await FrontPage.create(page, '/'));
  },

  frontPageFi: async ({ page }, use) => {
    await use(await FrontPage.create(page, '/fi'));
  },

  frontPageSv: async ({ page }, use) => {
    await use(await FrontPage.create(page, '/sv'));
  },

  frontPageEn: async ({ page }, use) => {
    await use(await FrontPage.create(page, '/en'));
  },
});

export { expect } from '@playwright/test';
