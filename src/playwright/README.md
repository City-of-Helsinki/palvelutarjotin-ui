# Playwright Tests

## Overview

This directory contains [Playwright](https://playwright.dev/) tests for the Palvelutarjotin UI project.

## Project Structure

```
src/playwright/
├── pages/               # Page object models
│   ...
│   └── search.page.ts   # e.g. SearchPage page object model
├── tests/               # Tests
│   ...
│   └── search.spec.ts   # e.g. search related tests
├── testWithFixtures.ts  # Test fixtures setup
```

## Setup

- See [Playwright's installation guide](https://playwright.dev/docs/intro)
- Setup `.env.test.local` for running the Playwright tests locally

## Running Tests

See [Playwright's Running and debugging tests](https://playwright.dev/docs/running-tests) documentation.

Build the production build of the UI and start the server
(Pages load faster than in development build):
```bash
yarn build
yarn start
```
Or if the development server is fast enough in your environment, then you can
use it with Playwright tests instead of the production build:
```bash
yarn dev
```

Then run the Playwright tests:
```bash
yarn playwright test
```

Other useful commands:

- Start interactive UI mode: `yarn playwright test --ui`
- Run tests only on Desktop Chrome: `yarn playwright test --project=chromium`
- Run tests in a specific file: `yarn playwright test filename`
- Run tests in debug mode: `yarn playwright test --debug`
- Autogenerate tests with Codegen: `yarn playwright codegen`

## Page Object Model

The tests use the [Page Object Model](https://playwright.dev/docs/pom) pattern to represent different pages in the application:

- [BasePage](./pages/base.page.ts) - Base class for all page objects
  - [FrontPage](./pages/front.page.ts) - Main landing page with language variants
  - [CmsPage](./pages/cms.page.ts) - Content management system page
    - [AccessibilityStatementCmsPage](./pages/accessibilityStatementCms.page.ts) - Accessibility statement page
  - [SearchPage](./pages/search.page.ts) - Search results page

## Test Fixtures

[Fixtures](https://playwright.dev/docs/test-fixtures) provide convenient access to page objects in tests, e.g.:

```typescript
// NOTE: Must import test from testWithFixtures or custom fixtures won't be available!
import { test } from '../testWithFixtures';

test('search button works', async ({ enFrontPage, searchPage }) => {
  await enFrontPage.clickSearchButton('Search events');
  await searchPage.isReady();
  await searchPage.isEnglish();
});
```

Available custom fixtures can be seen in [custom fixtures file](./testWithFixtures.ts).