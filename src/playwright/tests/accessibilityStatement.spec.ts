import { test } from '../testWithFixtures';

test.describe(() => {
  // These tests seem to be a bit flaky at times,
  // so let's retry them a couple of times to avoid false negatives.
  test.describe.configure({ retries: 2 });

  test('Finnish accessibility statement available through footer link at /', async ({
    defaultFrontPage,
    accessibilityStatementCmsPage,
  }) => {
    await defaultFrontPage.clickFooterLink('Saavutettavuusseloste');
    await accessibilityStatementCmsPage.isReady();
    await accessibilityStatementCmsPage.isFinnish();
  });

  test('Finnish accessibility statement available through footer link at /fi', async ({
    fiFrontPage,
    accessibilityStatementCmsPage,
  }) => {
    await fiFrontPage.clickFooterLink('Saavutettavuusseloste');
    await accessibilityStatementCmsPage.isReady();
    await accessibilityStatementCmsPage.isFinnish();
  });

  test('Swedish accessibility statement available through footer link at /sv', async ({
    svFrontPage,
    accessibilityStatementCmsPage,
  }) => {
    await svFrontPage.clickFooterLink('Tillgänglighetsutlåtande');
    await accessibilityStatementCmsPage.isReady();
    await accessibilityStatementCmsPage.isSwedish();
  });

  test('English accessibility statement available through footer link at /en', async ({
    enFrontPage,
    accessibilityStatementCmsPage,
  }) => {
    await enFrontPage.clickFooterLink('Accessibility Statement');
    await accessibilityStatementCmsPage.isReady();
    await accessibilityStatementCmsPage.isEnglish();
  });
});
