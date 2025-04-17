import { test } from '../testWithFixtures';

test.describe(() => {
  // Search page tests are flaky, possibly because of network issues
  // so let's retry them a couple of times to avoid false negatives.
  test.describe.configure({ retries: 2 });

  test(`pressing search button on Finnish front page goes to Finnish search page`, async ({
    fiFrontPage,
    searchPage,
  }) => {
    await fiFrontPage.clickSearchButton('Hae tapahtumia');
    await searchPage.isReady();
    await searchPage.isFinnish();
  });

  test(`pressing search button on Swedish front page goes to Swedish search page`, async ({
    svFrontPage,
    searchPage,
  }) => {
    await svFrontPage.clickSearchButton('Sök evenemang');
    await searchPage.isReady();
    await searchPage.isSwedish();
  });

  test(`pressing search button on English front page goes to English search page`, async ({
    enFrontPage,
    searchPage,
  }) => {
    await enFrontPage.clickSearchButton('Search events');
    await searchPage.isReady();
    await searchPage.isEnglish();
  });

  test(`searching with text and target group on Finnish front page goes to Finnish search page`, async ({
    fiFrontPage,
    searchPage,
  }) => {
    await fiFrontPage.clickSearchButton('Kohderyhmät');
    await fiFrontPage.clickSearchOption('0-2 vuotiaat');
    await fiFrontPage.fillSearchTextBox('Hae tapahtumia', 'Testiteksti');
    await fiFrontPage.clickSearchButton('Hae tapahtumia');
    await searchPage.isReady();
    await searchPage.isFinnish();
    await searchPage.containsSearchParams(
      new URLSearchParams({ text: 'Testiteksti', targetGroups: 'kultus:40' })
    );
  });

  test(`searching with text and target group on Swedish front page goes to Swedish search page`, async ({
    svFrontPage,
    searchPage,
  }) => {
    await svFrontPage.clickSearchButton('Målgrupp');
    await svFrontPage.clickSearchOption('0-2 år');
    await svFrontPage.fillSearchTextBox('Sök evenemang', 'Testtext');
    await svFrontPage.clickSearchButton('Sök evenemang');
    await searchPage.isReady();
    await searchPage.isSwedish();
    await searchPage.containsSearchParams(
      new URLSearchParams({ text: 'Testtext', targetGroups: 'kultus:40' })
    );
  });

  test(`searching with text and target group on English front page goes to English search page`, async ({
    enFrontPage,
    searchPage,
  }) => {
    await enFrontPage.clickSearchButton('Target groups');
    await enFrontPage.clickSearchOption('0-2 years');
    await enFrontPage.fillSearchTextBox('Search events', 'Test text');
    await enFrontPage.clickSearchButton('Search events');
    await searchPage.isReady();
    await searchPage.isEnglish();
    await searchPage.containsSearchParams(
      new URLSearchParams({ text: 'Test text', targetGroups: 'kultus:40' })
    );
  });
});
