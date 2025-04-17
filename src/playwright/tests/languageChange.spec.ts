import { test } from '../testWithFixtures';

test.describe(() => {
  // Front page language tests can be a bit flaky when run in parallel
  // with other tests, so let's retry them a couple of times to avoid false negatives.
  test.describe.configure({ retries: 2 });

  test('front page language can be changed using header language selector', async ({
    defaultFrontPage,
  }) => {
    await defaultFrontPage.clickHeaderButton('Suomi');
    await defaultFrontPage.isFinnish();
    await defaultFrontPage.clickHeaderButton('Svenska');
    await defaultFrontPage.isSwedish();
    await defaultFrontPage.clickHeaderButton('English');
    await defaultFrontPage.isEnglish();
    await defaultFrontPage.clickHeaderButton('Suomi');
    await defaultFrontPage.isFinnish();
  });

  test('/ page is in Finnish', async ({ defaultFrontPage }) => {
    await defaultFrontPage.isFinnish();
  });

  test('/fi page is in Finnish', async ({ fiFrontPage }) => {
    await fiFrontPage.isFinnish();
  });

  test('/sv page is in Swedish', async ({ svFrontPage }) => {
    await svFrontPage.isSwedish();
  });

  test('/en page is in English', async ({ enFrontPage }) => {
    await enFrontPage.isEnglish();
  });
});
