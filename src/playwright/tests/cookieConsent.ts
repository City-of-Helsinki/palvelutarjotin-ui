import { COOKIE_CONSENT_GIVEN_COOKIES } from '../constants';
import { test, expect } from '../testWithFixtures';

test('cookie consent is given by default', async ({ context }) => {
  const cookies = await context.cookies();
  expect(cookies).toEqual(expect.arrayContaining(COOKIE_CONSENT_GIVEN_COOKIES));
});

test('cookie consent box shows up, and can be approved', async ({
  defaultFrontPage,
  context,
}) => {
  await context.clearCookies();
  await defaultFrontPage.reload();
  await defaultFrontPage.isCookieConsentBoxVisible();
  await defaultFrontPage.approveCookies();
  await defaultFrontPage.isCookieConsentBoxHidden();
});

[0, 2_000, 5_000].forEach((delayMs) => {
  test(`cookie consent box does not show after ${delayMs}ms when cookies are already set`, async ({
    defaultFrontPage,
  }) => {
    await defaultFrontPage.isCookieConsentBoxHiddenAfterMs(delayMs);
  });
});
