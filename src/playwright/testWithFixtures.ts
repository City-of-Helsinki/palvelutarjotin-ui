// Disable linter rule that erroneously thinks Playwright's use function is a React hook:
/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

import {
  MOCK_ENROL_OCCURRENCE_MUTATION_RESPONSE,
  MOCK_EVENT_QUERY_RESPONSE,
  MOCK_EVENTS_QUERY_RESPONSE,
  MOCK_SCHOOLS_AND_KINDERGARTENS_LIST_QUERY_RESPONSE,
  MOCK_STUDY_LEVELS_QUERY_RESPONSE,
} from './mocks';
import { AccessibilityStatementCmsPage } from './pages/accessibilityStatementCms.page';
import { EventPage } from './pages/event.page';
import { FrontPage } from './pages/front.page';
import { SearchPage } from './pages/search.page';
import { blockGraphQLMutations, mockGraphQL } from './routeInterceptors';

type TestFixtures = {
  // Base page fixtures
  page: Page;
  accessibilityStatementCmsPage: AccessibilityStatementCmsPage;
  eventPage: EventPage;
  searchPage: SearchPage;
  // Parametrized versions of base page fixtures
  frontPage: FrontPage;
  frontPageFi: FrontPage;
  frontPageSv: FrontPage;
  frontPageEn: FrontPage;
  // Base data mock fixtures
  mockEnrolOccurrenceMutation: void;
  mockEventQuery: void;
  mockEventsQuery: void;
  mockSchoolsAndKindergartensListQuery: void;
  mockStudyLevelsQuery: void;
  // Compilations of base data mock fixtures
  mocksForSearchPage: void;
  mocksForEventPage: void;
};

export const test = base.extend<TestFixtures>({
  //--------------------------------------------------------------------------
  // Base page fixtures
  //--------------------------------------------------------------------------

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

  //--------------------------------------------------------------------------
  // Parametrized versions of base page fixtures
  //--------------------------------------------------------------------------
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

  //--------------------------------------------------------------------------
  // Base data mock fixtures
  //--------------------------------------------------------------------------
  mockEnrolOccurrenceMutation: async ({ page }, use) => {
    await use(
      await mockGraphQL(
        page,
        'EnrolOccurrence',
        MOCK_ENROL_OCCURRENCE_MUTATION_RESPONSE
      )
    );
  },

  mockEventQuery: async ({ page }, use) => {
    await use(await mockGraphQL(page, 'Event', MOCK_EVENT_QUERY_RESPONSE));
  },

  mockEventsQuery: async ({ page }, use) => {
    await use(await mockGraphQL(page, 'Events', MOCK_EVENTS_QUERY_RESPONSE));
  },

  mockSchoolsAndKindergartensListQuery: async ({ page }, use) => {
    await use(
      await mockGraphQL(
        page,
        'SchoolsAndKindergartensList',
        MOCK_SCHOOLS_AND_KINDERGARTENS_LIST_QUERY_RESPONSE
      )
    );
  },

  mockStudyLevelsQuery: async ({ page }, use) => {
    await use(
      await mockGraphQL(page, 'StudyLevels', MOCK_STUDY_LEVELS_QUERY_RESPONSE)
    );
  },

  //--------------------------------------------------------------------------
  // Compilations of base data mock fixtures
  //--------------------------------------------------------------------------

  // Allow unused variables to ease the compilation of fixtures
  /* eslint-disable @typescript-eslint/no-unused-vars */
  mocksForSearchPage: async (
    {
      mockEventsQuery, // To make search results shown on search page predictable
    },
    use
  ) => {
    await use();
  },

  mocksForEventPage: async (
    {
      mockEnrolOccurrenceMutation, // To be able to enrol without real data changes
      mockEventQuery, // To make event details shown on event page predictable
      mockSchoolsAndKindergartensListQuery, // To make study group unit selection predictable
      mockStudyLevelsQuery, // To make study level selection predictable
    },
    use
  ) => {
    await use();
  },
  /* eslint-enable @typescript-eslint/no-unused-vars */
});

export { expect } from '@playwright/test';
