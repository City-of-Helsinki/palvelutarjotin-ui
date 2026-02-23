import { test } from '../testWithFixtures';

test.describe(() => {
  // Search page tests are flaky, possibly because of network issues
  // so let's retry them a couple of times to avoid false negatives.
  test.describe.configure({ retries: 2 });

  test(`pressing search button on Finnish front page goes to Finnish search page`, async ({
    frontPageFi,
    searchPage,
  }) => {
    await frontPageFi.clickSearchButton('Hae tapahtumia');
    await searchPage.isReady();
    await searchPage.isFinnish();
  });

  test(`pressing search button on Swedish front page goes to Swedish search page`, async ({
    frontPageSv,
    searchPage,
  }) => {
    await frontPageSv.clickSearchButton('Sök evenemang');
    await searchPage.isReady();
    await searchPage.isSwedish();
  });

  test(`pressing search button on English front page goes to English search page`, async ({
    frontPageEn,
    searchPage,
  }) => {
    await frontPageEn.clickSearchButton('Search events');
    await searchPage.isReady();
    await searchPage.isEnglish();
  });

  test(`searching with text and target group on Finnish front page goes to Finnish search page`, async ({
    frontPageFi,
    searchPage,
  }) => {
    await frontPageFi.clickSearchButton('Tarkennettu haku');
    await frontPageFi.clickTargetGroupField('Kohderyhmät');
    await frontPageFi.clickSearchOption('0-2 vuotiaat');
    await frontPageFi.fillSearchTextBox('Hae tapahtumia', 'Testiteksti');
    await frontPageFi.clickSearchButton('Hae tapahtumia');
    await searchPage.isReady();
    await searchPage.isFinnish();
    await searchPage.containsSearchParams(
      new URLSearchParams({ text: 'Testiteksti', targetGroups: 'kultus:40' })
    );
  });

  test(`searching with text and target group on Swedish front page goes to Swedish search page`, async ({
    frontPageSv,
    searchPage,
  }) => {
    await frontPageSv.clickSearchButton('Detaljerad sökning');
    await frontPageSv.clickTargetGroupField('Målgrupp');
    await frontPageSv.clickSearchOption('0-2 år');
    await frontPageSv.fillSearchTextBox('Sök evenemang', 'Testtext');
    await frontPageSv.clickSearchButton('Sök evenemang');
    await searchPage.isReady();
    await searchPage.isSwedish();
    await searchPage.containsSearchParams(
      new URLSearchParams({ text: 'Testtext', targetGroups: 'kultus:40' })
    );
  });

  test(`searching with text and target group on English front page goes to English search page`, async ({
    frontPageEn,
    searchPage,
  }) => {
    await frontPageEn.clickSearchButton('Advanced search');
    await frontPageEn.clickTargetGroupField('Target groups');
    await frontPageEn.clickSearchOption('0-2 years');
    await frontPageEn.fillSearchTextBox('Search events', 'Test text');
    await frontPageEn.clickSearchButton('Search events');
    await searchPage.isReady();
    await searchPage.isEnglish();
    await searchPage.containsSearchParams(
      new URLSearchParams({ text: 'Test text', targetGroups: 'kultus:40' })
    );
  });
});
