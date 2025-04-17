import AppConfig from '../../domain/headless-cms/config';
import { getCookieConsentGivenCookies } from '../../utils/getCookieConsentGivenCookies';
import { test, expect } from '../testWithFixtures';

test('cookie consent is given by default', async ({ context }) => {
  const cookies = await context.cookies();
  expect(cookies).toEqual(
    expect.arrayContaining(
      getCookieConsentGivenCookies({ domain: AppConfig.hostname })
    )
  );
});

test('cookie consent box shows up, and can be approved', async ({
  frontPage,
  context,
}) => {
  await context.clearCookies();
  await frontPage.reload();
  await frontPage.isCookieConsentBoxVisible();
  await frontPage.approveCookies();
  await frontPage.isCookieConsentBoxHidden();
});

[0, 2_000, 5_000].forEach((delayMs) => {
  test(`cookie consent box does not show after ${delayMs}ms when cookies are already set`, async ({
    frontPage,
  }) => {
    await frontPage.waitForMs(delayMs);
    await frontPage.isCookieConsentBoxHidden({ timeout: 0 }); // Instant check
  });
});
