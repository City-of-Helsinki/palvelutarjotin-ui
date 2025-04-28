# Playwright Tests

This directory contains [Playwright](https://playwright.dev/) tests for the Palvelutarjotin UI project.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Project Structure](#project-structure)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Page Object Model](#page-object-model)
- [Test Fixtures](#test-fixtures)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

Using the **production build** of the UI for testing is **recommended**,
because the development server can be so slow as to make the tests fail.

But, if it happens that in your environment the development server is fast enough,
you can use it by setting:
- `PLAYWRIGHT_WEB_SERVER=dev` in `.env.test.local`

Otherwise the Playwright tests will use the production build.

If you chose to use the production build, build it with `yarn build` before running the tests.

Then run the Playwright tests:
```bash
yarn playwright test
```
which will spin up the web server and run all tests.

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