import { test } from '../testWithFixtures';

test.describe(() => {
  // These tests seem to be a bit flaky at times,
  // so let's retry them a couple of times to avoid false negatives.
  test.describe.configure({ retries: 2 });

  test('Finnish accessibility statement available through footer link at /', async ({
    frontPage,
    accessibilityStatementCmsPage,
  }) => {
    await frontPage.clickFooterLink('Saavutettavuusseloste');
    await accessibilityStatementCmsPage.isReady();
    await accessibilityStatementCmsPage.isFinnish();
  });

  test('Finnish accessibility statement available through footer link at /fi', async ({
    frontPageFi,
    accessibilityStatementCmsPage,
  }) => {
    await frontPageFi.clickFooterLink('Saavutettavuusseloste');
    await accessibilityStatementCmsPage.isReady();
    await accessibilityStatementCmsPage.isFinnish();
  });

  test('Swedish accessibility statement available through footer link at /sv', async ({
    frontPageSv,
    accessibilityStatementCmsPage,
  }) => {
    await frontPageSv.clickFooterLink('Tillgänglighetsutlåtande');
    await accessibilityStatementCmsPage.isReady();
    await accessibilityStatementCmsPage.isSwedish();
  });

  test('English accessibility statement available through footer link at /en', async ({
    frontPageEn,
    accessibilityStatementCmsPage,
  }) => {
    await frontPageEn.clickFooterLink('Accessibility Statement');
    await accessibilityStatementCmsPage.isReady();
    await accessibilityStatementCmsPage.isEnglish();
  });
});
