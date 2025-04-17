import { test, expect } from '@playwright/test';

import { LANGUAGES } from '../constants';

const eventCountRegex = {
  fi: /Tapahtumat \d+ kpl/,
  sv: /Evenemang \d+ st/,
  en: /Events \d+ pc/,
} as const;

const search = {
  fi: 'Hae tapahtumia',
  sv: 'Sök evenemang',
  en: 'Search events',
} as const;

const targetGroups = {
  fi: 'Kohderyhmät',
  sv: 'Målgrupp',
  en: 'Target groups',
} as const;

const zeroToTwoYears = {
  fi: '0-2 vuotiaat',
  sv: '0-2 år',
  en: '0-2 years',
} as const;

LANGUAGES.forEach((lang) => {
  test(`pressing ${lang} search button shows result count and changes URL`, async ({
    page,
  }) => {
    await page.goto(`/${lang}`);
    await expect(page).toHaveURL(`/${lang}`);
    await expect(page.getByText(eventCountRegex[lang])).not.toBeVisible();
    await page.getByRole('button', { name: search[lang] }).click();
    test.slow(); // The search page's load can be slow
    await expect(page).toHaveURL(`/${lang}/search`);
    await expect(page.getByText(eventCountRegex[lang])).toBeVisible();
  });
});

LANGUAGES.forEach((lang) => {
  test(`${lang} search with target group & text shows result count and changes URL`, async ({
    page,
  }) => {
    await page.goto(`/${lang}`);
    await page.getByRole('button', { name: targetGroups[lang] }).click();
    await page
      .getByRole('option', { name: zeroToTwoYears[lang] })
      .getByLabel('check')
      .click();
    await page.getByRole('textbox', { name: search[lang] }).click();
    await page.getByRole('textbox', { name: search[lang] }).fill('Test text');

    await expect(page).toHaveURL(`/${lang}`);
    await expect(page.getByText(eventCountRegex[lang])).not.toBeVisible();

    await page.getByRole('button', { name: search[lang] }).click();

    test.slow(); // The search page's load can be slow
    await expect(page).toHaveURL(
      `/${lang}/search?text=Test+text&targetGroups=kultus%3A40`
    );
    await expect(page.getByText(eventCountRegex[lang])).toBeVisible();
  });
});
