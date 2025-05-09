// Disable linter rule that erroneously thinks Playwright's use function is a React hook:
/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

import { AccessibilityStatementCmsPage } from './pages/accessibilityStatementCms.page';
import { EventPage } from './pages/event.page';
import { FrontPage } from './pages/front.page';
import { SearchPage } from './pages/search.page';
import { blockGraphQLMutations } from './utils';

type TestFixtures = {
  // Base fixtures
  page: Page;
  accessibilityStatementCmsPage: AccessibilityStatementCmsPage;
  eventPage: EventPage;
  searchPage: SearchPage;
  // Parametrized versions of base fixtures
  frontPage: FrontPage;
  frontPageFi: FrontPage;
  frontPageSv: FrontPage;
  frontPageEn: FrontPage;
};

export const test = base.extend<TestFixtures>({
  /**
   * Override the default page fixture, that all other page fixtures use,
   * to block GraphQL mutations by default. This is done to prevent unintentional data changes.
   */
  page: async ({ page }, use) => {
    await blockGraphQLMutations(page);
    await use(page);
  },

  eventPage: async ({ page }, use) => {
    await use(new EventPage(page));
  },

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
