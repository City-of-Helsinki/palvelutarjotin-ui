import { test, expect } from '@playwright/test';

import { LANGUAGES } from '../constants';
import { KultusPage } from '../KultusPage';

const accessibilityStatement = {
  fi: 'Saavutettavuusseloste',
  sv: 'Tillgänglighetsutlåtande',
  en: 'Accessibility Statement',
} as const;

LANGUAGES.forEach((lang) => {
  test(`${lang} accessibility statement accessible through footer link`, async ({
    page: origPage,
  }) => {
    const page = KultusPage.create(origPage);
    await page.goto(`/${lang}`);
    await page.clickFooterLink(accessibilityStatement[lang]);
    test.slow(); // CMS page's load can be slow
    await expect(page.h1).toContainText(accessibilityStatement[lang]);
  });
});
