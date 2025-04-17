import { test } from '../testWithFixtures';

test.describe(() => {
  // Front page language tests can be a bit flaky when run in parallel
  // with other tests, so let's retry them a couple of times to avoid false negatives.
  test.describe.configure({ retries: 2 });

  test('front page language can be changed using header language selector', async ({
    frontPage,
  }) => {
    await frontPage.clickHeaderButton('Suomi');
    await frontPage.isReady();
    await frontPage.isFinnish();
    await frontPage.clickHeaderButton('Svenska');
    await frontPage.isReady();
    await frontPage.isSwedish();
    await frontPage.clickHeaderButton('English');
    await frontPage.isReady();
    await frontPage.isEnglish();
    await frontPage.clickHeaderButton('Suomi');
    await frontPage.isReady();
    await frontPage.isFinnish();
  });

  test('/ page is in Finnish', async ({ frontPage }) => {
    await frontPage.isFinnish();
  });

  test('/fi page is in Finnish', async ({ frontPageFi }) => {
    await frontPageFi.isFinnish();
  });

  test('/sv page is in Swedish', async ({ frontPageSv }) => {
    await frontPageSv.isSwedish();
  });

  test('/en page is in English', async ({ frontPageEn }) => {
    await frontPageEn.isEnglish();
  });
});
